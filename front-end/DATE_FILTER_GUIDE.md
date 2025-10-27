# Date Filter Guide - Role Management

## Overview
Tính năng filter theo `created_date` đã được implement cho trang Roles Management với xử lý timezone tự động giữa local time (UI) và UTC time (database).

## Cách sử dụng

### 1. Chọn Date Range trong UI
- Mở trang `/admin/roles`
- Nhấn vào button "Filter by created date"
- Chọn ngày bắt đầu (from) và ngày kết thúc (to)
- Hoặc nhấn nút X để clear filter

### 2. Cách hoạt động

#### UI Layer (Local Time)
```typescript
// User chọn ngày trong calendar (local timezone)
// Ví dụ: User ở GMT+7 chọn 01/01/2024 00:00:00

const dateRange = {
  from: new Date(2024, 0, 1),  // Local: 01/01/2024 00:00:00 GMT+7
  to: new Date(2024, 11, 31)   // Local: 31/12/2024 23:59:59 GMT+7
};
```

#### Conversion to UTC (Automatic)
```typescript
// Code tự động convert sang UTC trước khi gửi API
const createdDateFrom = new Date(dateRange.from.setHours(0, 0, 0, 0)).toISOString();
// Result: "2023-12-31T17:00:00.000Z" (UTC)

const createdDateTo = new Date(dateRange.to.setHours(23, 59, 59, 999)).toISOString();
// Result: "2024-12-31T16:59:59.999Z" (UTC)
```

#### API Call
```typescript
// Request gửi lên backend
GET /api/roles?createdDateFrom=2023-12-31T17:00:00.000Z&createdDateTo=2024-12-31T16:59:59.999Z
```

#### Backend Processing
```java
// Spring Boot tự động parse ISO-8601 string → Instant (UTC)
@RequestParam(required = false) java.time.Instant createdDateFrom

// JPA Query với UTC time
WHERE r.createdDate >= :createdDateFrom AND r.createdDate <= :createdDateTo
```

#### Database (PostgreSQL)
```sql
-- Database lưu timestamptz (UTC)
-- So sánh trực tiếp với Instant (UTC) từ backend
SELECT * FROM role
WHERE created_date >= '2023-12-31 17:00:00+00'
  AND created_date <= '2024-12-31 16:59:59.999+00'
```

## Timezone Flow Chart

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER ACTION                              │
│  Chọn ngày: 01/01/2024 (Local Time - GMT+7)                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                             │
│  DateRange: { from: Date(2024-01-01), to: Date(2024-12-31) }   │
│  ↓                                                              │
│  Convert to UTC using .toISOString()                           │
│  ↓                                                              │
│  createdDateFrom: "2023-12-31T17:00:00.000Z"                   │
│  createdDateTo: "2024-12-31T16:59:59.999Z"                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API REQUEST                                  │
│  GET /api/roles?createdDateFrom=2023-12-31T17:00:00.000Z       │
│                &createdDateTo=2024-12-31T16:59:59.999Z          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                BACKEND (Spring Boot)                            │
│  @RequestParam Instant createdDateFrom                          │
│  ↓                                                              │
│  Spring auto-parse ISO-8601 → Instant (UTC)                    │
│  ↓                                                              │
│  Instant = 2023-12-31T17:00:00Z                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   JPA/HIBERNATE                                 │
│  hibernate.jdbc.time_zone=UTC (configured)                      │
│  ↓                                                              │
│  Query: WHERE r.createdDate >= :createdDateFrom                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│               DATABASE (PostgreSQL)                             │
│  Column: created_date TIMESTAMPTZ (stores UTC)                  │
│  ↓                                                              │
│  Compare: created_date >= '2023-12-31 17:00:00+00'             │
│  ↓                                                              │
│  Return matching roles                                          │
└─────────────────────────────────────────────────────────────────┘
```

## Files Changed

### Frontend
1. **`/src/core/models/role/role.types.ts`**
   - Added `createdDateFrom` and `createdDateTo` to `RoleFilterParams`

2. **`/src/components/ui/date-range-picker.tsx`** (NEW)
   - Reusable DateRangePicker component
   - Supports range selection with calendar UI
   - Has clear button to remove filter

3. **`/src/app/(dashboard)/admin/roles/data-table.tsx`**
   - Added `dateRange` and `onDateRangeChange` props
   - Integrated DateRangePicker component in filter bar

4. **`/src/app/(dashboard)/admin/roles/page.tsx`**
   - Added `dateRange` state
   - Convert DateRange to ISO-8601 (UTC) before API call
   - Pass date filter to RoleService.getRoles()

### Backend
1. **`RoleFilterParams` (TypeScript)** - Added date filter fields
2. **`RoleFilter.java`** - Added `createdDateFrom` and `createdDateTo` fields
3. **`RoleRepository.java`** - Updated query to support date filtering
4. **`RoleController.java`** - Added date parameters to search endpoint
5. **`RoleServiceImpl.java`** - Pass date filters to repository

## Important Notes

### ✅ Automatic Timezone Handling
- **NO manual timezone conversion needed** in most cases
- JavaScript `.toISOString()` automatically converts to UTC
- Spring Boot automatically parses ISO-8601 to Instant (UTC)
- PostgreSQL `timestamptz` stores everything in UTC
- JPA/Hibernate config `hibernate.jdbc.time_zone=UTC` ensures consistency

### ✅ Date Range Behavior
- **From date**: Set to 00:00:00.000 of selected day
- **To date**: Set to 23:59:59.999 of selected day
- This ensures the full day is included in the range

### ✅ Null Safety
- All date filters are optional
- If not provided, backend fetches all records (no date filtering)

### ⚠️ Common Pitfalls to Avoid

1. **DON'T manually adjust timezone in frontend**
   ```typescript
   // ❌ WRONG - Don't do this
   const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);

   // ✅ CORRECT - Use toISOString()
   const isoString = localDate.toISOString();
   ```

2. **DON'T use Date type in API params**
   ```java
   // ❌ WRONG
   @RequestParam Date createdDateFrom

   // ✅ CORRECT
   @RequestParam Instant createdDateFrom
   ```

3. **DON'T use TIMESTAMP without timezone**
   ```sql
   -- ❌ WRONG
   created_date TIMESTAMP

   -- ✅ CORRECT
   created_date TIMESTAMPTZ
   ```

## Testing

### Test Case 1: Basic Date Range Filter
```typescript
// Select: 01/01/2024 to 31/01/2024 (Local: GMT+7)
// API sends:
//   from: "2023-12-31T17:00:00.000Z"
//   to: "2024-01-31T16:59:59.999Z"
// Should return all roles created in January 2024 (UTC)
```

### Test Case 2: Clear Filter
```typescript
// Click X button to clear
// dateRange = undefined
// API sends: no date params
// Should return all roles
```

### Test Case 3: Single Day Selection
```typescript
// Select only: 01/01/2024 (no end date)
// from: "2023-12-31T17:00:00.000Z"
// to: undefined
// Should return all roles created from that date onwards
```

## Display Date in UI

When displaying `createdDate` in table, convert UTC back to local:

```typescript
// In columns-role.tsx
{
  accessorKey: "createdDate",
  header: "Created Date",
  cell: ({ row }) => {
    const date = new Date(row.getValue("createdDate"));
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  }
}
```

This will automatically show date in user's local timezone.

## Summary

| Layer | Time Representation | Type | Example |
|-------|---------------------|------|---------|
| **User Selection** | Local Time | Date object | `2024-01-01 00:00:00 GMT+7` |
| **Frontend API Call** | UTC (ISO-8601) | String | `"2023-12-31T17:00:00.000Z"` |
| **Backend Processing** | UTC | Instant | `2023-12-31T17:00:00Z` |
| **Database Storage** | UTC | TIMESTAMPTZ | `2023-12-31 17:00:00+00` |
| **API Response** | UTC (ISO-8601) | String | `"2023-12-31T17:00:00.000Z"` |
| **UI Display** | Local Time | Formatted string | `31/12/2023 00:00:00 GMT+7` |

**Key Principle**: Store and query in UTC, display in local time!
