"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { DataTable } from "./data-table";
import { UserService } from "@/core/services/user/user.service";
import { User } from "@/core/models/user/user.types";
import { Plus, RefreshCw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createColumnUsers } from "./columns-user";

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [usersToDelete, setUsersToDelete] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [userToActivate, setUserToActivate] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [sortBy, setSortBy] = useState<"EMAIL" | "USERNAME" | "CREATED_DATE" | "STATUS">("CREATED_DATE");
  const [orderBy, setOrderBy] = useState<"ASC" | "DESC">("DESC");

  const [statusFilter, setStatusFilter] = useState<"none" | "active" | "deleted">("none");

  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPageIndex(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      const statusParam = statusFilter === "none"
        ? undefined
        : statusFilter === "active" ? false : true;

      const createdDateFrom = dateFrom
        ? new Date(dateFrom.setHours(0, 0, 0, 0)).toISOString()
        : undefined;

      const createdDateTo = dateTo
        ? new Date(dateTo.setHours(23, 59, 59, 999)).toISOString()
        : undefined;

      const response = await UserService.getUsers({
        search: debouncedSearchTerm || undefined,
        page: pageIndex,
        size: pageSize,
        sortBy: sortBy,
        orderBy: orderBy,
        status: statusParam,
        createdDateFrom,
        createdDateTo,
      });

      if (response.isSuccess && response.data) {
        setUsers(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, pageIndex, pageSize, sortBy, orderBy, statusFilter, dateFrom, dateTo, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePaginationChange = (newPageIndex: number, newPageSize: number) => {
    setPageIndex(newPageIndex);
    setPageSize(newPageSize);
  };

  const handleSort = (newSortBy: "EMAIL" | "USERNAME" | "CREATED_DATE" | "STATUS", newOrderBy: "ASC" | "DESC") => {
    setSortBy(newSortBy);
    setOrderBy(newOrderBy);
    setPageIndex(0);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as "none" | "active" | "deleted");
    setPageIndex(0);
  };

  const handleDateFromChange = (date: Date | undefined) => {
    setDateFrom(date);
    setPageIndex(0);
  };

  const handleDateToChange = (date: Date | undefined) => {
    setDateTo(date);
    setPageIndex(0);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      setIsSubmitting(true);
      await UserService.deleteUser(userToDelete.id);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      await fetchUsers();
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkDelete = async (users: User[]) => {
    setUsersToDelete(users);
    setDeleteDialogOpen(true);
  };

  const confirmBulkDelete = async () => {
    if (usersToDelete.length === 0) return;

    try {
      setIsSubmitting(true);
      // Delete users one by one since backend doesn't have bulk delete
      await Promise.all(usersToDelete.map((user) => UserService.deleteUser(user.id)));
      toast({
        title: "Success",
        description: `${usersToDelete.length} user(s) deleted successfully`,
      });
      await fetchUsers();
      setDeleteDialogOpen(false);
      setUsersToDelete([]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete users",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActivate = async () => {
    if (!userToActivate) return;

    try {
      setIsSubmitting(true);
      await UserService.activateUser(userToActivate.id);
      toast({
        title: "Success",
        description: "User activated successfully",
      });
      await fetchUsers();
      setActivateDialogOpen(false);
      setUserToActivate(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to activate user",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleViewUser = (event: Event) => {
      const customEvent = event as CustomEvent<User>;
      router.push(`/admin/users/${customEvent.detail.id}`);
    };

    const handleEditUser = (event: Event) => {
      const customEvent = event as CustomEvent<User>;
      router.push(`/admin/users/${customEvent.detail.id}/edit`);
    };

    const handleDeleteUser = (event: Event) => {
      const customEvent = event as CustomEvent<User>;
      setUserToDelete(customEvent.detail);
      setUsersToDelete([]);
      setDeleteDialogOpen(true);
    };

    const handleActivateUser = (event: Event) => {
      const customEvent = event as CustomEvent<User>;
      setUserToActivate(customEvent.detail);
      setActivateDialogOpen(true);
    };

    window.addEventListener("viewUser", handleViewUser);
    window.addEventListener("editUser", handleEditUser);
    window.addEventListener("deleteUser", handleDeleteUser);
    window.addEventListener("activateUser", handleActivateUser);

    return () => {
      window.removeEventListener("viewUser", handleViewUser);
      window.removeEventListener("editUser", handleEditUser);
      window.removeEventListener("deleteUser", handleDeleteUser);
      window.removeEventListener("activateUser", handleActivateUser);
    };
  }, [router]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Users Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage system users and their roles
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            disabled={loading}
            className="flex-1 sm:flex-initial"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button
            onClick={() => router.push("/admin/users/create")}
            className="flex-1 sm:flex-initial"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Create User</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </div>
      </div>

      {/* Data Table Card */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">Users</CardTitle>
          <CardDescription className="text-sm">
            View and manage all system users
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <DataTable
              columns={createColumnUsers({
                onSort: handleSort,
                currentSortBy: sortBy,
                currentOrderBy: orderBy,
              })}
              data={users}
              onDeleteSelected={handleBulkDelete}
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusFilterChange={handleStatusFilterChange}
              dateFrom={dateFrom}
              dateTo={dateTo}
              onDateFromChange={handleDateFromChange}
              onDateToChange={handleDateToChange}
              pageCount={totalPages}
              pageIndex={pageIndex}
              pageSize={pageSize}
              totalElements={totalElements}
              onPaginationChange={handlePaginationChange}
            />
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {usersToDelete.length > 0
                ? `This action will delete ${usersToDelete.length} user(s). This action cannot be undone.`
                : userToDelete
                ? `This action will delete the user "${userToDelete.email}". This action cannot be undone.`
                : "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (usersToDelete.length > 0) {
                  confirmBulkDelete();
                } else {
                  handleDelete();
                }
              }}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
              {userToActivate
                ? `This will reactivate the user "${userToActivate.email}" and unblock them in Auth0. They will be able to log in again.`
                : "Confirm user activation."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleActivate();
              }}
              disabled={isSubmitting}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Activate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
