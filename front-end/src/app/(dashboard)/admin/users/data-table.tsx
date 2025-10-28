"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTablePagination } from "@/components/TablePagination";
import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";
import { ChevronDown, Trash2, X } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onDeleteSelected?: (rows: TData[]) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  statusFilter?: "none" | "active" | "deleted";
  onStatusFilterChange?: (value: string) => void;
  dateFrom?: Date;
  dateTo?: Date;
  onDateFromChange?: (date: Date | undefined) => void;
  onDateToChange?: (date: Date | undefined) => void;
  // Server-side pagination
  pageCount?: number;
  pageIndex?: number;
  pageSize?: number;
  totalElements?: number;
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onDeleteSelected,
  searchValue = "",
  onSearchChange,
  statusFilter = "none",
  onStatusFilterChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  pageCount = 0,
  pageIndex = 0,
  pageSize = 20,
  totalElements,
  onPaginationChange,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    pageCount,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
      columnVisibility,
      rowSelection,
    },
  });

  const handleDeleteSelected = () => {
    const selectedRows = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original);

    if (onDeleteSelected && selectedRows.length > 0) {
      onDeleteSelected(selectedRows);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Row */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-3 lg:flex-1">
          {/* Search Input */}
          <div className="relative w-full lg:max-w-md">
            <Input
              placeholder="Search by email or username..."
              value={searchValue}
              onChange={(event) => onSearchChange?.(event.target.value)}
              className="w-full pr-10"
            />
            {searchValue && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSearchChange?.("")}
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-muted-foreground whitespace-nowrap min-w-fit">
                Status:
              </label>
              <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="deleted">Deleted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Divider - Hidden on mobile */}
            <div className="hidden sm:block h-6 w-px bg-border" />

            {/* Date Range Filter */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
              <label className="text-sm font-medium text-muted-foreground whitespace-nowrap min-w-fit">
                Created Date:
              </label>
              <div className="flex items-center gap-2">
                <DatePicker
                  date={dateFrom}
                  onDateChange={onDateFromChange}
                  placeholder="From"
                  maxDate={dateTo}
                  className="flex-1 sm:flex-initial"
                />
                <span className="text-sm text-muted-foreground">-</span>
                <DatePicker
                  date={dateTo}
                  onDateChange={onDateToChange}
                  placeholder="To"
                  minDate={dateFrom}
                  className="flex-1 sm:flex-initial"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0 self-start">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteSelected}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete ({table.getFilteredSelectedRowModel().rows.length})
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table Container - Horizontal scroll on mobile */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        table={table}
        onPaginationChange={onPaginationChange}
        totalElements={totalElements}
      />
    </div>
  );
}
