"use client";

import { useState, useEffect } from "react";
import { UserProfileService } from "@/core/services/user/user-profile.service";
import { UserProfile, UpdateUserProfileRequest } from "@/core/models/user/user.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, User, Key, Calendar, Shield, Edit2, X, Save, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(
          formData.password
        )
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

    if (!validateForm()) {
      return;
    }

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <AlertDescription>Failed to load profile. Please try again.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-5xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                <AvatarImage src={profile.url_avatar} alt={profile.name} />
                <AvatarFallback className="text-xl">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left space-y-2">
                <CardTitle className="text-2xl">{profile.name}</CardTitle>
                <CardDescription className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {profile.email}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    @{profile.username}
                  </span>
                </CardDescription>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {profile.roles.map((role) => (
                    <Badge key={role.id} variant="secondary" className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      {role.code}
                    </Badge>
                  ))}
                  {profile.activated && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Active
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Edit Mode */}
                <div className="grid gap-6 sm:grid-cols-1">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={errors.name ? "border-red-500" : ""}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">Change Password</Label>
                      <p className="text-sm text-muted-foreground">
                        Leave blank to keep your current password
                      </p>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <Label htmlFor="password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                          }
                          className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                          placeholder="Enter new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-red-500">{errors.password}</p>
                      )}
                      {!errors.password && formData.password && (
                        <p className="text-xs text-muted-foreground">
                          Must be 8-128 characters with uppercase, lowercase, number, and
                          special character (@$!%*?&)
                        </p>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData({ ...formData, confirmPassword: e.target.value })
                          }
                          className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                          placeholder="Confirm new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={saving}
                    className="w-full sm:w-auto"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="w-full sm:w-auto"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              /* View Mode */
              <div className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Full Name</Label>
                    <p className="text-base font-medium">{profile.name}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="text-base font-medium">{profile.email}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Username</Label>
                    <p className="text-base font-medium">@{profile.username}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Status</Label>
                    <div>
                      {profile.activated ? (
                        <Badge className="bg-green-50 text-green-700 border-green-200">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Inactive</Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Account Created
                    </Label>
                    <p className="text-base">{formatDate(profile.created_date)}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Last Modified
                    </Label>
                    <p className="text-base">{formatDate(profile.last_modified_date)}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    Roles & Permissions
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {profile.roles.map((role) => (
                      <Badge
                        key={role.id}
                        variant="secondary"
                        className="text-sm px-3 py-1"
                      >
                        {role.code}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-1">
                    <Key className="h-4 w-4" />
                    Password
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Click "Edit Profile" to change your password
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
