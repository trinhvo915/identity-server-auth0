"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Role } from "@/core/models/role/role.types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2, Copy } from "lucide-react";
import { formatUTCToLocal, DateFormats } from "@/core/utils/helper/date.utils";

interface ColumnRolesProps {
  onSort?: (sortBy: "REQUEST_CODE" | "CREATED_DATE" | "LAST_MODIFIED_DATE" | "STATUS", orderBy: "ASC" | "DESC") => void;
  currentSortBy?: string;
  currentOrderBy?: "ASC" | "DESC";
}

export const createColumnRoles = (props?: ColumnRolesProps): ColumnDef<Role>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => {
      const role = row.original;
      const isSystemRole = role.code === "USER" || role.code === "ADMIN";

      return (
        <Checkbox
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          checked={row.getIsSelected()}
          disabled={isSystemRole}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: "code",
    header: () => {
      const isActive = props?.currentSortBy === "REQUEST_CODE";
      return (
        <Button
          variant="ghost"
          onClick={() => {
            const newOrder = isActive && props?.currentOrderBy === "ASC" ? "DESC" : "ASC";
            props?.onSort?.("REQUEST_CODE", newOrder);
          }}
          className="hover:bg-muted"
        >
          Role Code
          <ArrowUpDown className={`ml-2 h-4 w-4 ${isActive ? "text-primary" : ""}`} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const role = row.original;
      const isSystemRole = role.code === "USER" || role.code === "ADMIN";

      return (
        <div className="font-medium flex items-center gap-2">
          <Badge variant="outline" className="font-mono">
            {row.getValue("code")}
          </Badge>
          {isSystemRole && (
            <Badge variant="secondary" className="text-xs">
              System
            </Badge>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="max-w-[200px] sm:max-w-md truncate" title={description}>
          {description || "-"}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "isDelete",
    header: () => {
      const isActive = props?.currentSortBy === "STATUS";
      return (
        <Button
          variant="ghost"
          onClick={() => {
            const newOrder = isActive && props?.currentOrderBy === "ASC" ? "DESC" : "ASC";
            props?.onSort?.("STATUS", newOrder);
          }}
          className="hover:bg-muted"
        >
          Status
          <ArrowUpDown className={`ml-2 h-4 w-4 ${isActive ? "text-primary" : ""}`} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isDelete = row.getValue("isDelete") as boolean;
      return (
        <Badge variant={isDelete ? "destructive" : "default"}>
          {isDelete ? "Deleted" : "Active"}
        </Badge>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "createdDate",
    header: () => {
      const isActive = props?.currentSortBy === "CREATED_DATE";
      return (
        <Button
          variant="ghost"
          onClick={() => {
            const newOrder = isActive && props?.currentOrderBy === "ASC" ? "DESC" : "ASC";
            props?.onSort?.("CREATED_DATE", newOrder);
          }}
          className="hover:bg-muted"
        >
          Created Date
          <ArrowUpDown className={`ml-2 h-4 w-4 ${isActive ? "text-primary" : ""}`} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("createdDate") as string;
      return (
        <div className="text-sm text-muted-foreground">
          {formatUTCToLocal(date, DateFormats.SHORT_DATE_TIME)}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "lastModifiedDate",
    header: () => {
      const isActive = props?.currentSortBy === "LAST_MODIFIED_DATE";
      return (
        <Button
          variant="ghost"
          onClick={() => {
            const newOrder = isActive && props?.currentOrderBy === "ASC" ? "DESC" : "ASC";
            props?.onSort?.("LAST_MODIFIED_DATE", newOrder);
          }}
          className="hover:bg-muted"
        >
          Last Modified
          <ArrowUpDown className={`ml-2 h-4 w-4 ${isActive ? "text-primary" : ""}`} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("lastModifiedDate") as string;
      return (
        <div className="text-sm text-muted-foreground">
          {formatUTCToLocal(date, DateFormats.SHORT_DATE_TIME)}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    id: "actions",
    enableHiding: false,
    size: 60,
    cell: ({ row }) => {
      const role = row.original;
      const isSystemRole = role.code === "USER" || role.code === "ADMIN";

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(role.id)}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Role ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                // Edit action - will be handled by parent component
                const event = new CustomEvent("editRole", { detail: role });
                window.dispatchEvent(event);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (!isSystemRole) {
                  // Delete action - will be handled by parent component
                  const event = new CustomEvent("deleteRole", { detail: role });
                  window.dispatchEvent(event);
                }
              }}
              disabled={isSystemRole}
              className={isSystemRole ? "text-muted-foreground cursor-not-allowed" : "text-red-600"}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
              {isSystemRole && <span className="ml-2 text-xs">(System Role)</span>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
