import { ApiResponse } from "@/core/models/common/model.common";

export interface RoleBase {
  id: string;
  code: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  auth0_user_id: string;
  name: string;
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

export type UserProfileResponse = ApiResponse<UserProfile>;

export interface UpdateUserProfileRequest {
  name: string;
  password?: string;
}
