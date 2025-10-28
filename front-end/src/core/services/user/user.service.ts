import { ApiService } from '@/core/services/api.service';
import {
  UsersResponse,
  UserResponse,
  CreateUserRequest,
  UpdateUserRoleRequest,
  UserFilter
} from '@/core/models/user/user.types';

export class UserService {
  private static readonly BASE_URL = '/users';

  static async getUsers(filter: UserFilter): Promise<UsersResponse> {
    const params: Record<string, any> = {
      page: filter.page ?? 0,
      size: filter.size ?? 20,
      sortBy: filter.sortBy ?? 'EMAIL',
      orderBy: filter.orderBy ?? 'ASC',
    };

    if (filter.search) {
      params.search = filter.search;
    }

    if (filter.status !== undefined) {
      params.status = filter.status;
    }

    if (filter.createdDateFrom) {
      params.createdDateFrom = filter.createdDateFrom;
    }

    if (filter.createdDateTo) {
      params.createdDateTo = filter.createdDateTo;
    }

    if (filter.roleIds && filter.roleIds.length > 0) {
      params.roleIds = filter.roleIds;
    }

    const response = await ApiService.get<UsersResponse>(this.BASE_URL, { params });
    return response.data;
  }

  static async getUserById(userId: string): Promise<UserResponse> {
    const response = await ApiService.get<UserResponse>(`${this.BASE_URL}/${userId}`);
    return response.data;
  }

  static async createUser(data: CreateUserRequest): Promise<UserResponse> {
    const response = await ApiService.post<UserResponse>(this.BASE_URL, data);
    return response.data;
  }

  static async updateUser(userId: string, data: UpdateUserRoleRequest): Promise<UserResponse> {
    const response = await ApiService.put<UserResponse>(`${this.BASE_URL}/role/${userId}`, data);
    return response.data;
  }

  static async deleteUser(userId: string): Promise<UserResponse> {
    const response = await ApiService.delete<UserResponse>(`${this.BASE_URL}/${userId}`);
    return response.data;
  }

  static async activateUser(userId: string): Promise<UserResponse> {
    const response = await ApiService.put<UserResponse>(`${this.BASE_URL}/${userId}/activate`, {});
    return response.data;
  }
}
