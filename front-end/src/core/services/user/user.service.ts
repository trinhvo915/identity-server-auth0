import { ApiService } from '@/core/services/api.service';

/**
 * User interface
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * User list response
 */
export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Create user request
 */
export interface CreateUserRequest {
  email: string;
  name?: string;
  password: string;
  role?: string;
}

/**
 * Update user request
 */
export interface UpdateUserRequest {
  email?: string;
  name?: string;
  role?: string;
}

/**
 * User Service
 * Handles all user-related API calls
 */
export class UserService {
  private static readonly BASE_URL = '/users';

  /**
   * Get all users with pagination
   * Requires authentication
   */
  static async getUsers(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    role?: string;
  }) {
    return ApiService.get<UserListResponse>(this.BASE_URL, { params });
  }

  /**
   * Get user by ID
   * Requires authentication
   */
  static async getUserById(userId: string) {
    return ApiService.get<User>(`${this.BASE_URL}/${userId}`);
  }

  /**
   * Get current user profile
   * Requires authentication
   */
  static async getCurrentUser() {
    return ApiService.get<User>(`${this.BASE_URL}/me`);
  }

  /**
   * Create new user
   * Requires authentication and ADMIN role
   */
  static async createUser(data: CreateUserRequest) {
    return ApiService.post<User>(this.BASE_URL, data);
  }

  /**
   * Update user
   * Requires authentication and ADMIN role or own user
   */
  static async updateUser(userId: string, data: UpdateUserRequest) {
    return ApiService.patch<User>(`${this.BASE_URL}/${userId}`, data);
  }

  /**
   * Delete user
   * Requires authentication and ADMIN role
   */
  static async deleteUser(userId: string) {
    return ApiService.delete(`${this.BASE_URL}/${userId}`);
  }

  /**
   * Upload user avatar
   * Requires authentication
   */
  static async uploadAvatar(
    userId: string,
    file: File,
    onProgress?: (progress: number) => void
  ) {
    const formData = new FormData();
    formData.append('avatar', file);

    return ApiService.upload<User>(
      `${this.BASE_URL}/${userId}/avatar`,
      formData,
      (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      }
    );
  }

  /**
   * Get public user profile (no authentication required)
   * This is an example of a public endpoint
   */
  static async getPublicProfile(username: string) {
    return ApiService.getPublic<User>(`${this.BASE_URL}/public/${username}`);
  }
}
