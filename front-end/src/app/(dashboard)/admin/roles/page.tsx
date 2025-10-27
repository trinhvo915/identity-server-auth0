"use client";

import { useEffect, useState, useCallback } from "react";
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
import { RoleForm } from "./role-form";
import { RoleService } from "@/core/services/role/role.service";
import { Role, CreateRoleRequest } from "@/core/models/role/role.types";
import { Plus, RefreshCw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createColumnRoles } from "@/app/(dashboard)/admin/roles/columns-role";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [rolesToDelete, setRolesToDelete] = useState<Role[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Pagination state
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Sorting state
  const [sortBy, setSortBy] = useState<"REQUEST_CODE" | "CREATED_DATE" | "LAST_MODIFIED_DATE" | "STATUS">("CREATED_DATE");
  const [orderBy, setOrderBy] = useState<"ASC" | "DESC">("DESC");

  // Status filter state (none = null, active = false, deleted = true)
  const [statusFilter, setStatusFilter] = useState<"none" | "active" | "deleted">("none");

  // Date filter state - separate from and to dates
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

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);

      // none = undefined (null in API), active = false, deleted = true
      const statusParam = statusFilter === "none"
        ? undefined
        : statusFilter === "active" ? false : true;

      // Convert Date to ISO-8601 strings (UTC)
      // When user selects a date in local time, we convert it to UTC for the API
      const createdDateFrom = dateFrom
        ? new Date(dateFrom.setHours(0, 0, 0, 0)).toISOString()
        : undefined;

      const createdDateTo = dateTo
        ? new Date(dateTo.setHours(23, 59, 59, 999)).toISOString()
        : undefined;

      const response = await RoleService.getRoles({
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
        setRoles(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch roles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, pageIndex, pageSize, sortBy, orderBy, statusFilter, dateFrom, dateTo, toast]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handlePaginationChange = (newPageIndex: number, newPageSize: number) => {
    setPageIndex(newPageIndex);
    setPageSize(newPageSize);
  };

  const handleSort = (newSortBy: "REQUEST_CODE" | "CREATED_DATE" | "LAST_MODIFIED_DATE" | "STATUS", newOrderBy: "ASC" | "DESC") => {
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
    setPageIndex(0); // Reset to first page when filter changes
  };

  const handleDateToChange = (date: Date | undefined) => {
    setDateTo(date);
    setPageIndex(0); // Reset to first page when filter changes
  };

  const handleSubmit = async (data: CreateRoleRequest) => {
    try {
      setIsSubmitting(true);
      if (selectedRole) {
        await RoleService.updateRole(selectedRole.id, data);
        toast({
          title: "Success",
          description: "Role updated successfully",
        });
      } else {
        await RoleService.createRole(data);
        toast({
          title: "Success",
          description: "Role created successfully",
        });
      }
      await fetchRoles();
      setFormOpen(false);
      setSelectedRole(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save role",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!roleToDelete) return;

    try {
      setIsSubmitting(true);
      await RoleService.deleteRole(roleToDelete.id);
      toast({
        title: "Success",
        description: "Role deleted successfully",
      });
      await fetchRoles();
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete role",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkDelete = async (roles: Role[]) => {
    setRolesToDelete(roles);
    setDeleteDialogOpen(true);
  };

  const confirmBulkDelete = async () => {
    if (rolesToDelete.length === 0) return;

    try {
      setIsSubmitting(true);
      const ids = rolesToDelete.map((role) => role.id);
      await RoleService.bulkDeleteRoles(ids);
      toast({
        title: "Success",
        description: `${rolesToDelete.length} role(s) deleted successfully`,
      });
      await fetchRoles();
      setDeleteDialogOpen(false);
      setRolesToDelete([]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete roles",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleEditRole = (event: Event) => {
      const customEvent = event as CustomEvent<Role>;
      setSelectedRole(customEvent.detail);
      setFormOpen(true);
    };

    const handleDeleteRole = (event: Event) => {
      const customEvent = event as CustomEvent<Role>;
      setRoleToDelete(customEvent.detail);
      setRolesToDelete([]);
      setDeleteDialogOpen(true);
    };

    window.addEventListener("editRole", handleEditRole);
    window.addEventListener("deleteRole", handleDeleteRole);

    return () => {
      window.removeEventListener("editRole", handleEditRole);
      window.removeEventListener("deleteRole", handleDeleteRole);
    };
  }, []);

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8 pt-4 sm:pt-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Roles Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage system roles and permissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchRoles}
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
            onClick={() => {
              setSelectedRole(null);
              setFormOpen(true);
            }}
            className="flex-1 sm:flex-initial"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Create Role</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </div>
      </div>

      {/* Data Table Card */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">Roles</CardTitle>
          <CardDescription className="text-sm">
            View and manage all system roles
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <DataTable
              columns={createColumnRoles({
                onSort: handleSort,
                currentSortBy: sortBy,
                currentOrderBy: orderBy,
              })}
              data={roles}
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

      <RoleForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) {
            setSelectedRole(null);
          }
        }}
        onSubmit={handleSubmit}
        role={selectedRole}
        isLoading={isSubmitting}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {rolesToDelete.length > 0
                ? `This action will delete ${rolesToDelete.length} role(s). This action cannot be undone.`
                : roleToDelete
                ? `This action will delete the role "${roleToDelete.code}". This action cannot be undone.`
                : "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (rolesToDelete.length > 0) {
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
    </div>
  );
}
