"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  className,
  disabled = false,
  minDate,
  maxDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleClear = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onDateChange?.(undefined);
    setOpen(false);
  };

  const handleSelect = (selectedDate: Date | undefined) => {
    onDateChange?.(selectedDate);
    setOpen(false);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full sm:w-[200px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate flex-1">
              {date ? (
                format(date, "MMM dd, yyyy")
              ) : (
                <span>{placeholder}</span>
              )}
            </span>
            {date && !disabled && (
              <button
                type="button"
                className="ml-2 h-4 w-4 flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity inline-flex items-center justify-center"
                onClick={handleClear}
                aria-label="Clear date"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" sideOffset={5}>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
            disabled={(day) => {
              if (minDate && day < minDate) return true;
              if (maxDate && day > maxDate) return true;
              return false;
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
