import {ApiResponse, PageResponse} from "@/core/models/common/model.common";

export interface Role {
  id: string;
  code: string;
  description: string;
  createdBy: string;
  createdDate: string;
  lastModifiedDate: string;
  isDelete: boolean;
}

export type RoleListResponse = ApiResponse<PageResponse<Role>>;

export type RoleResponse = ApiResponse<Role>;

export type ActiveRolesResponse = ApiResponse<Role[]>;

export interface CreateRoleRequest {
  code: string;
  description: string;
}

export interface UpdateRoleRequest {
  code?: string;
  description?: string;
}

export type SortByRole = "REQUEST_CODE" | "CREATED_DATE" | "LAST_MODIFIED_DATE" | "STATUS";
export type SortDirection = "ASC" | "DESC";

export interface RoleFilterParams {
  search?: string;
  page?: number;
  size?: number;
  sortBy?: SortByRole;
  orderBy?: SortDirection;
  status?: boolean;
  createdDateFrom?: string; // ISO-8601 format
  createdDateTo?: string;   // ISO-8601 format
}
