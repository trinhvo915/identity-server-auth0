import { ApiService } from '@/core/services/api.service';
import {CreateUserFromAuth0Request, UpdateUserProfileRequest, UserProfileResponse} from '@/core/models/user/user.types';

export class UserProfileService {
  private static readonly BASE_URL = '/profile';

  static async getProfile(): Promise<UserProfileResponse> {
    const response = await ApiService.get<UserProfileResponse>(this.BASE_URL);
    return response.data;
  }

  static async updateProfile(data: UpdateUserProfileRequest): Promise<UserProfileResponse> {
    const response = await ApiService.put<UserProfileResponse>(this.BASE_URL, data);
    return response.data;
  }

  static async syncUserFromAuth0AndGetRoles(data: CreateUserFromAuth0Request): Promise<UserProfileResponse> {
    const response = await ApiService.post<UserProfileResponse>(`${this.BASE_URL}/auth0`, data);
    return response.data;
  }
}
