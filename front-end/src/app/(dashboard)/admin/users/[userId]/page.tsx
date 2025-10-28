"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserService } from "@/core/services/user/user.service";
import { User } from "@/core/models/user/user.types";
import { ArrowLeft, Loader2, Pencil, Trash2, Mail, User as UserIcon, Calendar, Shield, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatUTCToLocal, DateFormats } from "@/core/utils/helper/date.utils";
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

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await UserService.getUserById(userId);

        if (response.isSuccess && response.data) {
          setUser(response.data);
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

    fetchUser();
  }, [userId, router, toast]);

  const handleDelete = async () => {
    if (!user) return;

    try {
      setIsDeleting(true);
      await UserService.deleteUser(user.id);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      router.push("/admin/users");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
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

      // Refresh user data
      const response = await UserService.getUserById(userId);
      if (response.isSuccess && response.data) {
        setUser(response.data);
      }

      setActivateDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to activate user",
        variant: "destructive",
      });
    } finally {
      setIsActivating(false);
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

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.username.slice(0, 2).toUpperCase();

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
        <div className="flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            User Details
          </h2>
          <p className="text-sm text-muted-foreground">
            View detailed information about this user
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/users/${userId}/edit`)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          {user.is_delete ? (
            <Button
              variant="default"
              size="sm"
              onClick={() => setActivateDialogOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Activate
            </Button>
          ) : (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* User Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.url_avatar} alt={user.username} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name || user.username}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4" />
                {user.email}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Username</label>
                <p className="text-sm mt-1 font-mono">{user.username}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm mt-1">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <p className="text-sm mt-1">{user.name || "-"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Auth0 User ID</label>
                <p className="text-sm mt-1 font-mono break-all">{user.auth0_user_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Account Status</label>
                <div className="mt-1">
                  <Badge variant={user.activated ? "default" : "secondary"}>
                    {user.activated ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Deletion Status</label>
                <div className="mt-1">
                  <Badge variant={user.is_delete ? "destructive" : "default"}>
                    {user.is_delete ? "Deleted" : "Active"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Roles */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Assigned Roles
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.roles.map((role) => (
                <Badge key={role.id} variant="outline" className="text-sm">
                  {role.code}
                </Badge>
              ))}
              {user.roles.length === 0 && (
                <p className="text-sm text-muted-foreground">No roles assigned</p>
              )}
            </div>
          </div>

          {/* Audit Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Audit Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created By</label>
                <p className="text-sm mt-1">{user.created_by || "-"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created Date</label>
                <p className="text-sm mt-1">
                  {user.created_date
                    ? formatUTCToLocal(user.created_date, DateFormats.FULL_DATE_TIME)
                    : "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Modified By</label>
                <p className="text-sm mt-1">{user.last_modified_by || "-"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Modified Date</label>
                <p className="text-sm mt-1">
                  {user.last_modified_date
                    ? formatUTCToLocal(user.last_modified_date, DateFormats.FULL_DATE_TIME)
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete the user "{user.email}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
