"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  placeholder = "Pick a date range",
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleClear = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Clear the date range immediately
    onDateRangeChange?.(undefined);
    // Close the popover
    setOpen(false);
  };

  const handleSelect = (range: DateRange | undefined) => {
    onDateRangeChange?.(range);
    // Auto close when both dates are selected
    if (range?.from && range?.to) {
      setOpen(false);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate flex-1">
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd, yyyy")}
                  </>
                ) : (
                  format(dateRange.from, "MMM dd, yyyy")
                )
              ) : (
                <span>{placeholder}</span>
              )}
            </span>
            {(dateRange?.from || dateRange?.to) && (
              <button
                type="button"
                className="ml-2 h-4 w-4 flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity inline-flex items-center justify-center"
                onClick={handleClear}
                aria-label="Clear date range"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" sideOffset={5}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
