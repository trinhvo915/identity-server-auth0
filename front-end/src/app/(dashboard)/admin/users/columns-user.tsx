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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/core/models/user/user.types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Eye, Pencil, Trash2, Copy, CheckCircle } from "lucide-react";
import { formatUTCToLocal, DateFormats } from "@/core/utils/helper/date.utils";

interface ColumnUsersProps {
  onSort?: (sortBy: "EMAIL" | "USERNAME" | "CREATED_DATE" | "STATUS", orderBy: "ASC" | "DESC") => void;
  currentSortBy?: string;
  currentOrderBy?: "ASC" | "DESC";
}

export const createColumnUsers = (props?: ColumnUsersProps): ColumnDef<User>[] => [
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
    cell: ({ row }) => (
      <Checkbox
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        checked={row.getIsSelected()}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: "username",
    header: () => {
      const isActive = props?.currentSortBy === "USERNAME";
      return (
        <Button
          variant="ghost"
          onClick={() => {
            const newOrder = isActive && props?.currentOrderBy === "ASC" ? "DESC" : "ASC";
            props?.onSort?.("USERNAME", newOrder);
          }}
          className="hover:bg-muted"
        >
          Username
          <ArrowUpDown className={`ml-2 h-4 w-4 ${isActive ? "text-primary" : ""}`} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      const initials = user.name
        ? user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : user.username.slice(0, 2).toUpperCase();

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.url_avatar} alt={user.username} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.getValue("username")}</div>
            {user.name && (
              <div className="text-xs text-muted-foreground">{user.name}</div>
            )}
          </div>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "email",
    header: () => {
      const isActive = props?.currentSortBy === "EMAIL";
      return (
        <Button
          variant="ghost"
          onClick={() => {
            const newOrder = isActive && props?.currentOrderBy === "ASC" ? "DESC" : "ASC";
            props?.onSort?.("EMAIL", newOrder);
          }}
          className="hover:bg-muted"
        >
          Email
          <ArrowUpDown className={`ml-2 h-4 w-4 ${isActive ? "text-primary" : ""}`} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase text-sm">{row.getValue("email")}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => {
      const roles = row.getValue("roles") as User["roles"];
      return (
        <div className="flex flex-wrap gap-1">
          {roles.map((role) => (
            <Badge key={role.id} variant="outline" className="text-xs">
              {role.code}
            </Badge>
          ))}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "is_delete",
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
      const isDelete = row.getValue("is_delete") as boolean;
      return (
        <Badge variant={isDelete ? "destructive" : "default"}>
          {isDelete ? "Deleted" : "Active"}
        </Badge>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "created_date",
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
      const date = row.getValue("created_date") as string;
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
      const user = row.original;

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
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy User ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                const event = new CustomEvent("viewUser", { detail: user });
                window.dispatchEvent(event);
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const event = new CustomEvent("editUser", { detail: user });
                window.dispatchEvent(event);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            {user.is_delete ? (
              <DropdownMenuItem
                onClick={() => {
                  const event = new CustomEvent("activateUser", { detail: user });
                  window.dispatchEvent(event);
                }}
                className="text-green-600"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Activate
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => {
                  const event = new CustomEvent("deleteUser", { detail: user });
                  window.dispatchEvent(event);
                }}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
