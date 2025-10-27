import { format, formatDistanceToNow } from "date-fns";

/**
 * Format UTC date string to local time
 * @param utcDateString - UTC date string from backend (ISO 8601 format)
 * @param formatPattern - Date format pattern (default: "MMM dd, yyyy HH:mm")
 * @returns Formatted local date string
 */
export const formatUTCToLocal = (
  utcDateString: string | null | undefined,
  formatPattern: string = "MMM dd, yyyy HH:mm"
): string => {
  if (!utcDateString) return "-";

  try {
    const date = new Date(utcDateString);
    return format(date, formatPattern);
  } catch (error) {
    console.error("Error formatting date:", error);
    return utcDateString;
  }
};

/**
 * Format UTC date to relative time (e.g., "2 hours ago")
 * @param utcDateString - UTC date string from backend
 * @returns Relative time string
 */
export const formatUTCToRelative = (
  utcDateString: string | null | undefined
): string => {
  if (!utcDateString) return "-";

  try {
    const date = new Date(utcDateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error("Error formatting relative date:", error);
    return utcDateString;
  }
};

/**
 * Common date format patterns
 */
export const DateFormats = {
  FULL_DATE_TIME: "MMMM dd, yyyy HH:mm:ss",
  SHORT_DATE_TIME: "MMM dd, yyyy HH:mm",
  DATE_ONLY: "MMM dd, yyyy",
  TIME_ONLY: "HH:mm:ss",
  ISO_DATE: "yyyy-MM-dd",
  YEAR_MONTH: "MMM yyyy",
} as const;

/**
 * Get current local date in specific format
 * @param formatPattern - Date format pattern
 * @returns Formatted current date
 */
export const getCurrentLocalDate = (
  formatPattern: string = DateFormats.SHORT_DATE_TIME
): string => {
  return format(new Date(), formatPattern);
};

/**
 * Check if date string is valid
 * @param dateString - Date string to validate
 * @returns True if valid, false otherwise
 */
export const isValidDate = (dateString: string | null | undefined): boolean => {
  if (!dateString) return false;

  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
};

/**
 * Convert local date to UTC ISO string for API
 * @param localDate - Local date object
 * @returns UTC ISO string
 */
export const convertLocalToUTC = (localDate: Date): string => {
  return localDate.toISOString();
};
