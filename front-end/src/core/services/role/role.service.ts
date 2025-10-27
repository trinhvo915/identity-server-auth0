import { ApiService } from '@/core/services/api.service';
import {
  RoleListResponse,
  RoleResponse,
  CreateRoleRequest,
  UpdateRoleRequest,
  RoleFilterParams,
} from '@/core/models/role/role.types';
import {ApiResponse} from "@/core/models/common/model.common";

export class RoleService {
  private static readonly BASE_URL = '/roles';

  static async getRoles(params?: RoleFilterParams): Promise<RoleListResponse> {
    const response = await ApiService.get<RoleListResponse>(
      this.BASE_URL,
      { params }
    );
    return response.data;
  }

  static async getRoleById(id: string): Promise<RoleResponse> {
    const response = await ApiService.get<RoleResponse>(
      `${this.BASE_URL}/${id}`
    );
    return response.data;
  }

  static async createRole(data: CreateRoleRequest): Promise<RoleResponse> {
    const response = await ApiService.post<RoleResponse>(
      this.BASE_URL,
      data
    );
    return response.data;
  }

  static async updateRole(
    id: string,
    data: UpdateRoleRequest
  ): Promise<RoleResponse> {
    const response = await ApiService.put<RoleResponse>(
      `${this.BASE_URL}/${id}`,
      data
    );
    return response.data;
  }

  static async deleteRole(id: string): Promise<ApiResponse<void>> {
    const response = await ApiService.delete<ApiResponse<void>>(
      `${this.BASE_URL}/${id}`
    );
    return response.data;
  }

  static async bulkDeleteRoles(ids: string[]): Promise<ApiResponse<void>> {
    const response = await ApiService.post<ApiResponse<void>>(
      `${this.BASE_URL}/bulk-delete`,
      { ids }
    );
    return response.data;
  }
}
