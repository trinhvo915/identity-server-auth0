"use client";

import { useState, useEffect } from "react";
import { UserProfileService } from "@/core/services/user/user-profile.service";
import { UserProfile, UpdateUserProfileRequest } from "@/core/models/user/user.types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Edit2, X, Save, Calendar, Shield, Key } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Shared Components (System-wide)
import {
  PageHeader,
  InfoSection,
  InfoField,
  InfoGrid,
  FormField,
  FormActions,
  LoadingState,
} from "@/components/shared";

// Profile-specific Components
import { UserProfileCard } from "../../../components/profile/UserProfileCard";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await UserProfileService.getProfile();
      setProfile(response.data);
      setFormData({
        name: response.data.name || "",
        password: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to load profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      name: "",
      password: "",
      confirmPassword: "",
    };

    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (formData.name.length > 100) {
      newErrors.name = "Name must be less than 100 characters";
      isValid = false;
    }

    if (formData.password) {
      if (formData.password.length < 8 || formData.password.length > 128) {
        newErrors.password = "Password must be between 8 and 128 characters";
        isValid = false;
      } else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(formData.password)
      ) {
        newErrors.password =
          "Password must contain uppercase, lowercase, number, and special character (@$!%*?&)";
        isValid = false;
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      const updateData: UpdateUserProfileRequest = {
        name: formData.name,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await UserProfileService.updateProfile(updateData);

      toast({
        title: "Success",
        description: response.message || "Profile updated successfully",
      });

      setProfile((prev) => (prev ? { ...prev, name: formData.name } : null));
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      setIsEditing(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || "",
      password: "",
      confirmPassword: "",
    });
    setErrors({ name: "", password: "", confirmPassword: "" });
    setIsEditing(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>Failed to load profile. Please try again.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your account settings and preferences"
        action={
          !isEditing
            ? {
                label: "Edit Profile",
                onClick: () => setIsEditing(true),
                icon: <Edit2 className="mr-2 h-4 w-4" />,
              }
            : undefined
        }
      />

      <UserProfileCard
        name={profile.name}
        email={profile.email}
        username={profile.username}
        avatarUrl={profile.url_avatar}
        roles={profile.roles}
        isActivated={profile.activated}
      >
        <Separator className="mb-6" />

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Full Name"
              id="name"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
              error={errors.name}
              placeholder="Enter your full name"
              required
            />

            <Separator className="my-6" />

            <div className="space-y-4">
              <div>
                <h4 className="text-base font-semibold">Change Password</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Leave blank to keep your current password
                </p>
              </div>

              <FormField
                label="New Password"
                id="password"
                type="password"
                value={formData.password}
                onChange={(value) => setFormData({ ...formData, password: value })}
                error={errors.password}
                placeholder="Enter new password"
                showPasswordToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                hint={
                  formData.password
                    ? "Must be 8-128 characters with uppercase, lowercase, number, and special character (@$!%*?&)"
                    : undefined
                }
              />

              <FormField
                label="Confirm New Password"
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
                error={errors.confirmPassword}
                placeholder="Confirm new password"
                showPasswordToggle
                showPassword={showConfirmPassword}
                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>

            <FormActions
              onCancel={handleCancel}
              submitLabel="Save Changes"
              cancelLabel="Cancel"
              isSubmitting={saving}
              submitIcon={saving ? undefined : <Save className="mr-2 h-4 w-4" />}
              cancelIcon={<X className="mr-2 h-4 w-4" />}
            />
          </form>
        ) : (
          <div className="space-y-8">
            <InfoSection title="Personal Information">
              <InfoGrid columns={2}>
                <InfoField label="Full Name" value={profile.name} />
                <InfoField label="Email" value={profile.email} />
                <InfoField label="Username" value={`@${profile.username}`} />
                <InfoField
                  label="Account Status"
                  value={
                    profile.activated ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Inactive</Badge>
                    )
                  }
                />
              </InfoGrid>
            </InfoSection>

            <Separator />

            <InfoSection title="Account Activity">
              <InfoGrid columns={2}>
                <InfoField
                  label="Account Created"
                  value={formatDate(profile.created_date)}
                  icon={Calendar}
                />
                <InfoField
                  label="Last Modified"
                  value={formatDate(profile.last_modified_date)}
                  icon={Calendar}
                />
              </InfoGrid>
            </InfoSection>

            <Separator />

            <InfoSection title="Roles & Permissions" icon={Shield}>
              <div className="flex flex-wrap gap-2">
                {profile.roles.map((role) => (
                  <Badge key={role.id} variant="secondary" className="text-sm px-4 py-1.5">
                    {role.code}
                  </Badge>
                ))}
              </div>
            </InfoSection>

            <Separator />

            <InfoSection title="Security" icon={Key}>
              <p className="text-sm text-muted-foreground">
                Click "Edit Profile" to change your password
              </p>
            </InfoSection>
          </div>
        )}
      </UserProfileCard>
    </div>
  );
}
