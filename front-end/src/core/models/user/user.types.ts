import { ApiResponse, PageResponse } from "@/core/models/common/model.common";

export interface RoleBase {
  id: string;
  code: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  auth0_user_id: string;
  name: string;
  given_name?: string;
  family_name?: string;
  activated: boolean;
  url_avatar?: string;
  roles: RoleBase[];
  created_by?: string;
  created_date?: string;
  last_modified_by?: string;
  last_modified_date?: string;
  is_delete: boolean;
  message?: string;
}

export type UserProfile = User;

export type UserProfileResponse = ApiResponse<UserProfile>;

export type UserResponse = ApiResponse<User>;

export type UsersResponse = ApiResponse<PageResponse<User>>;

export interface UpdateUserProfileRequest {
  name: string;
  password?: string;
}

export interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
  name?: string;
}

export interface CreateUserFromAuth0Request {
  sub: string;
  email?: string;
  name?: string;
  picture?: any;
}

export interface UpdateUserRoleRequest {
  name: string;
  roleIds: string[];
}

export interface UserFilter {
  search?: string;
  page?: number;
  size?: number;
  sortBy?: "EMAIL" | "USERNAME" | "CREATED_DATE" | "STATUS";
  orderBy?: "ASC" | "DESC";
  status?: boolean;
  createdDateFrom?: string;
  createdDateTo?: string;
  roleIds?: string[];
}
