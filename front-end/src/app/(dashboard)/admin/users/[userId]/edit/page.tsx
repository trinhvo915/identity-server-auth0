"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UserService } from "@/core/services/user/user.service";
import { RoleService } from "@/core/services/role/role.service";
import { UpdateUserRoleRequest, User } from "@/core/models/user/user.types";
import { Role } from "@/core/models/role/role.types";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const { toast } = useToast();

  const form = useForm<UpdateUserRoleRequest>({
    defaultValues: {
      name: "",
      roleIds: [],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [userResponse, rolesResponse] = await Promise.all([
          UserService.getUserById(userId),
          RoleService.getActiveRoles(),
        ]);

        if (userResponse.isSuccess && userResponse.data) {
          setUser(userResponse.data);
          form.reset({
            name: userResponse.data.name,
            roleIds: userResponse.data.roles.map((role) => role.id),
          });
        }

        if (rolesResponse.isSuccess && rolesResponse.data) {
          setAllRoles(rolesResponse.data);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch user data",
          variant: "destructive",
        });
        router.push("/admin/users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, form, router, toast]);

  // Check if form has changes
  const nameChanged = user ? form.watch("name") !== user.name : false;
  const roleIdsChanged = user
    ? JSON.stringify(form.watch("roleIds")?.sort()) !== JSON.stringify(user.roles.map((r) => r.id).sort())
    : false;
  const hasChanges = nameChanged || roleIdsChanged;

  const handleSubmit = async (data: UpdateUserRoleRequest) => {
    try {
      setIsSubmitting(true);
      const response = await UserService.updateUser(userId, data);

      if (response.isSuccess) {
        toast({
          title: "Success",
          description: response.message || "User updated successfully",
        });
        router.push("/admin/users");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActivate = async () => {
    if (!user) return;

    try {
      setIsActivating(true);
      await UserService.activateUser(user.id);
      toast({
        title: "Success",
        description: "User activated successfully",
      });
      router.push("/admin/users");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to activate user",
        variant: "destructive",
      });
    } finally {
      setIsActivating(false);
      setActivateDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Edit User
          </h2>
          <p className="text-sm text-muted-foreground">
            Update user information and roles
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Update the user's name and assign roles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Read-only fields */}
              <div className="space-y-4 p-4 bg-muted rounded-lg">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm mt-1">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Username</label>
                  <p className="text-sm mt-1">{user.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <p className="text-sm mt-1">
                    {user.activated ? "Active" : "Inactive"}
                    {user.is_delete && " (Deleted)"}
                  </p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="name"
                rules={{
                  required: "Name is required",
                  maxLength: {
                    value: 100,
                    message: "Name must not exceed 100 characters",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      User's full name (will be synced to Auth0)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roleIds"
                rules={{
                  validate: (value) =>
                    value.length > 0 || "At least one role must be selected",
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roles</FormLabel>
                    <FormDescription>
                      Select roles to assign to this user
                    </FormDescription>
                    <div className="space-y-2 mt-2">
                      {allRoles.map((role) => (
                        <div
                          key={role.id}
                          className="flex items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(role.id)}
                              onCheckedChange={(checked) => {
                                const updatedValue = checked
                                  ? [...(field.value || []), role.id]
                                  : field.value?.filter((id) => id !== role.id) || [];
                                field.onChange(updatedValue);
                              }}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <label className="text-sm font-medium cursor-pointer">
                              {role.code}
                            </label>
                            {role.description && (
                              <p className="text-sm text-muted-foreground">
                                {role.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                {user.is_delete && (
                  <Button
                    type="button"
                    variant="default"
                    onClick={() => setActivateDialogOpen(true)}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Activate User
                  </Button>
                )}
                <Button type="submit" disabled={isSubmitting || !hasChanges}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update User
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AlertDialog open={activateDialogOpen} onOpenChange={setActivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Activate User</AlertDialogTitle>
            <AlertDialogDescription>
              This will reactivate the user "{user.email}" and unblock them in Auth0. They will be able to log in again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isActivating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleActivate();
              }}
              disabled={isActivating}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {isActivating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Activate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
