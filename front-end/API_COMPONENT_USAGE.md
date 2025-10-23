# API Usage trong React Components

## Mục lục
1. [Basic Usage](#1-basic-usage)
2. [Error Handling](#2-error-handling)
3. [Loading States](#3-loading-states)
4. [Form Submissions](#4-form-submissions)
5. [Data Tables](#5-data-tables)
6. [File Upload](#6-file-upload)
7. [Real-time Updates](#7-real-time-updates)
8. [Best Practices](#8-best-practices)

---

## 1. Basic Usage

### Fetch Data on Mount

```typescript
'use client';

import { useEffect, useState } from 'react';
import { ApiService } from '@/core/services/api.service';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await ApiService.get<User[]>('/users');
      setUsers(response.data);
    } catch (error) {
      // Error đã được handle bởi interceptor
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Fetch với Query Parameters

```typescript
const loadUsers = async (page: number, search: string) => {
  const response = await ApiService.get<UserListResponse>('/users', {
    params: {
      page,
      pageSize: 10,
      search,
      role: 'ADMIN'
    }
  });

  setUsers(response.data.users);
  setTotal(response.data.total);
};
```

---

## 2. Error Handling

### Basic Error Handling

```typescript
import { getApiErrorMessage, isApiError } from '@/core/services/api.service';

const deleteUser = async (userId: string) => {
  try {
    await ApiService.delete(`/users/${userId}`);
    alert('User deleted successfully!');
    loadUsers(); // Refresh list
  } catch (error) {
    // Get user-friendly error message
    const message = getApiErrorMessage(error);
    alert(message);
  }
};
```

### Advanced Error Handling

```typescript
const createUser = async (userData: CreateUserRequest) => {
  try {
    const response = await ApiService.post<User>('/users', userData);
    return response.data;
  } catch (error) {
    // Check specific error codes
    if (isApiError(error, 409)) {
      setError('Email already exists');
    } else if (isApiError(error, 422)) {
      setError('Invalid input data');
    } else {
      setError(getApiErrorMessage(error));
    }
    throw error;
  }
};
```

### Error State Management

```typescript
export default function UserForm() {
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (data: any) => {
    setError(null);
    setFieldErrors({});

    try {
      await ApiService.post('/users', data);
      alert('Success!');
    } catch (err: any) {
      // Handle validation errors
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        setError(getApiErrorMessage(err));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}

      <input
        name="email"
        type="email"
      />
      {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}

      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## 3. Loading States

### Simple Loading

```typescript
export default function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await ApiService.get<User>(`/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  if (loading) {
    return <div>Loading user profile...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return <div>{user.name}</div>;
}
```

### Loading với Skeleton UI

```typescript
import { Skeleton } from '@/components/ui/skeleton';

export default function UserCard({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiService.get<User>(`/users/${userId}`)
      .then(res => setUser(res.data))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    );
  }

  return (
    <div>
      <h3>{user?.name}</h3>
      <p>{user?.email}</p>
    </div>
  );
}
```

### Multiple Loading States

```typescript
export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    // Load users
    ApiService.get<User[]>('/users')
      .then(res => setUsers(res.data))
      .finally(() => setLoadingUsers(false));

    // Load stats
    ApiService.get<Stats>('/stats')
      .then(res => setStats(res.data))
      .finally(() => setLoadingStats(false));
  }, []);

  return (
    <div>
      {loadingUsers ? <Skeleton /> : <UserList users={users} />}
      {loadingStats ? <Skeleton /> : <StatsCard stats={stats} />}
    </div>
  );
}
```

---

## 4. Form Submissions

### Basic Form with React Hook Form

```typescript
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ApiService, getApiErrorMessage } from '@/core/services/api.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UserFormData {
  email: string;
  name: string;
  password: string;
}

export default function CreateUserForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserFormData>();

  const onSubmit = async (data: UserFormData) => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await ApiService.post<User>('/users', data);
      console.log('User created:', response.data);
      alert('User created successfully!');
      reset(); // Clear form
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <Input
          {...register('email', { required: 'Email is required' })}
          type="email"
          placeholder="Email"
        />
        {errors.email && <span className="text-red-500">{errors.email.message}</span>}
      </div>

      <div>
        <Input
          {...register('name')}
          placeholder="Name"
        />
      </div>

      <div>
        <Input
          {...register('password', { required: 'Password is required' })}
          type="password"
          placeholder="Password"
        />
        {errors.password && <span className="text-red-500">{errors.password.message}</span>}
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Creating...' : 'Create User'}
      </Button>
    </form>
  );
}
```

### Form with Optimistic Updates

```typescript
export default function UpdateUserForm({ userId, initialData }: Props) {
  const [user, setUser] = useState(initialData);
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (field: string, value: string) => {
    // Optimistic update
    setUser(prev => ({ ...prev, [field]: value }));

    setSaving(true);
    try {
      const response = await ApiService.patch<User>(`/users/${userId}`, {
        [field]: value
      });
      // Update with real data from server
      setUser(response.data);
    } catch (error) {
      // Revert on error
      setUser(initialData);
      alert(getApiErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <input
        value={user.name}
        onChange={(e) => handleUpdate('name', e.target.value)}
        disabled={saving}
      />
      {saving && <span>Saving...</span>}
    </div>
  );
}
```

---

## 5. Data Tables

### Table with Pagination

```typescript
'use client';

import { useState, useEffect } from 'react';
import { ApiService } from '@/core/services/api.service';
import { Button } from '@/components/ui/button';

interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
}

export default function UserTable() {
  const [data, setData] = useState<UserListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadUsers();
  }, [page, search]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await ApiService.get<UserListResponse>('/users', {
        params: { page, pageSize: 10, search }
      });
      setData(response.data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure?')) return;

    try {
      await ApiService.delete(`/users/${userId}`);
      loadUsers(); // Refresh table
    } catch (error) {
      alert(getApiErrorMessage(error));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data</div>;

  return (
    <div>
      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search users..."
      />

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Button onClick={() => handleDelete(user.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex gap-2">
        <Button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span>Page {page} of {Math.ceil(data.total / data.pageSize)}</span>
        <Button
          onClick={() => setPage(p => p + 1)}
          disabled={page >= Math.ceil(data.total / data.pageSize)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
```

---

## 6. File Upload

### Upload with Progress

```typescript
'use client';

import { useState } from 'react';
import { ApiService } from '@/core/services/api.service';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function AvatarUpload({ userId }: { userId: string }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await ApiService.upload<User>(
        `/users/${userId}/avatar`,
        formData,
        (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        }
      );

      console.log('Upload success:', response.data);
      alert('Avatar uploaded successfully!');
    } catch (error) {
      alert(getApiErrorMessage(error));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground">
            Uploading: {progress}%
          </p>
        </div>
      )}
    </div>
  );
}
```

### Drag & Drop Upload

```typescript
import { useCallback } from 'react';

export default function FileDropzone() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      await ApiService.upload('/uploads', formData);
      alert('Files uploaded successfully!');
    } catch (error) {
      alert(getApiErrorMessage(error));
    } finally {
      setUploading(false);
    }
  }, []);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed p-8 ${isDragging ? 'border-blue-500' : 'border-gray-300'}`}
    >
      {uploading ? 'Uploading...' : 'Drag & drop files here'}
    </div>
  );
}
```

---

## 7. Real-time Updates

### Auto-refresh Data

```typescript
export default function LiveUserCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Initial load
    loadCount();

    // Refresh every 5 seconds
    const interval = setInterval(loadCount, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadCount = async () => {
    try {
      const response = await ApiService.get<{ count: number }>('/users/count');
      setCount(response.data.count);
    } catch (error) {
      console.error('Failed to load count:', error);
    }
  };

  return <div>Total Users: {count}</div>;
}
```

### Manual Refresh

```typescript
export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await ApiService.get<User[]>('/users');
      setUsers(response.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">
          Last updated: {lastUpdated?.toLocaleTimeString()}
        </span>
        <Button onClick={loadUsers} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 8. Best Practices

### ✅ DO's

#### 1. Cleanup in useEffect

```typescript
useEffect(() => {
  let cancelled = false;

  const loadData = async () => {
    try {
      const response = await ApiService.get('/users');
      if (!cancelled) {
        setUsers(response.data);
      }
    } catch (error) {
      if (!cancelled) {
        console.error(error);
      }
    }
  };

  loadData();

  return () => {
    cancelled = true;
  };
}, []);
```

#### 2. Debounce Search

```typescript
import { useCallback } from 'react';

export default function UserSearch() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<User[]>([]);

  // Debounce search
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query) {
        setResults([]);
        return;
      }

      const response = await ApiService.get<User[]>('/users/search', {
        params: { q: query }
      });
      setResults(response.data);
    }, 500),
    []
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    debouncedSearch(value);
  };

  return (
    <input
      value={search}
      onChange={(e) => handleSearchChange(e.target.value)}
      placeholder="Search users..."
    />
  );
}
```

#### 3. Custom Hooks

```typescript
// hooks/useUsers.ts
import { useState, useEffect } from 'react';
import { ApiService } from '@/core/services/api.service';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.get<User[]>('/users');
      setUsers(response.data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    await ApiService.delete(`/users/${userId}`);
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  return { users, loading, error, loadUsers, deleteUser };
}

// Usage in component
export default function UserList() {
  const { users, loading, error, deleteUser } = useUsers();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name}
          <button onClick={() => deleteUser(user.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

#### 4. Error Boundaries

```typescript
// components/ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-100 border border-red-400 rounded">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <UserList />
</ErrorBoundary>
```

### ❌ DON'Ts

#### 1. ❌ Không handle errors trong interceptor

```typescript
// BAD - Errors đã được handle bởi interceptor
try {
  await ApiService.get('/users');
} catch (error) {
  // 401/403/500 đã auto redirect rồi
  // Không cần alert hay show error message
  window.location.href = '/401'; // ❌ Duplicate redirect
}

// GOOD
try {
  await ApiService.get('/users');
} catch (error) {
  // Chỉ handle business logic errors
  console.error('Failed to load users:', error);
}
```

#### 2. ❌ Không cleanup subscriptions

```typescript
// BAD
useEffect(() => {
  const interval = setInterval(() => {
    loadData();
  }, 5000);
  // Missing cleanup
}, []);

// GOOD
useEffect(() => {
  const interval = setInterval(() => {
    loadData();
  }, 5000);

  return () => clearInterval(interval);
}, []);
```

#### 3. ❌ Không check component unmounted

```typescript
// BAD
const loadData = async () => {
  const response = await ApiService.get('/users');
  setUsers(response.data); // Component might be unmounted
};

// GOOD
useEffect(() => {
  let mounted = true;

  const loadData = async () => {
    const response = await ApiService.get('/users');
    if (mounted) {
      setUsers(response.data);
    }
  };

  loadData();
  return () => { mounted = false; };
}, []);
```

---

## Summary

**Key Points:**
1. ✅ Sử dụng `ApiService` thay vì axios trực tiếp
2. ✅ Handle loading states để UX tốt
3. ✅ Cleanup effects và subscriptions
4. ✅ Debounce search inputs
5. ✅ Tạo custom hooks cho reusability
6. ✅ Use TypeScript interfaces
7. ❌ Không handle 401/403/500 manually (auto redirect)
8. ❌ Không forget cleanup trong useEffect

**Error Flow:**
- 401 → Auto redirect `/401`
- 403 → Auto redirect `/access-denied`
- 500+ → Auto redirect `/500?status=xxx`
- 404/422/etc → Handle trong component

**Common Patterns:**
- Fetch on mount → `useEffect(() => loadData(), [])`
- Form submit → `try/catch` với loading state
- Delete → Confirm → API call → Refresh list
- Upload → FormData → Progress callback
- Search → Debounce → API call
