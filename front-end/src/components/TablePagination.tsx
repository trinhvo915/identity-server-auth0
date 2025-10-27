import { Table } from "@tanstack/react-table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  onPaginationChange?: (pageIndex: number, pageSize: number) => void
  totalElements?: number
}

export function DataTablePagination<TData>({
  table,
  onPaginationChange,
  totalElements,
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  // Calculate range for server-side pagination
  const from = totalElements ? pageIndex * pageSize + 1 : 0;
  const to = totalElements ? Math.min((pageIndex + 1) * pageSize, totalElements) : 0;

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex-1 flex items-center gap-4">
        {selectedCount > 0 && (
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{selectedCount}</span> of{" "}
            <span className="font-medium text-foreground">{table.getFilteredRowModel().rows.length}</span> row(s) selected
          </div>
        )}
        {totalElements !== undefined && totalElements > 0 && (
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{from}</span> to{" "}
            <span className="font-medium text-foreground">{to}</span> of{" "}
            <span className="font-medium text-foreground">{totalElements}</span> results
          </div>
        )}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              const newPageSize = Number(value);
              if (onPaginationChange) {
                onPaginationChange(0, newPageSize); // Reset to first page when changing page size
              } else {
                table.setPageSize(newPageSize);
              }
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              if (onPaginationChange) {
                onPaginationChange(0, table.getState().pagination.pageSize);
              } else {
                table.setPageIndex(0);
              }
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              if (onPaginationChange) {
                onPaginationChange(
                  table.getState().pagination.pageIndex - 1,
                  table.getState().pagination.pageSize
                );
              } else {
                table.previousPage();
              }
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              if (onPaginationChange) {
                onPaginationChange(
                  table.getState().pagination.pageIndex + 1,
                  table.getState().pagination.pageSize
                );
              } else {
                table.nextPage();
              }
            }}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              if (onPaginationChange) {
                onPaginationChange(
                  table.getPageCount() - 1,
                  table.getState().pagination.pageSize
                );
              } else {
                table.setPageIndex(table.getPageCount() - 1);
              }
            }}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
