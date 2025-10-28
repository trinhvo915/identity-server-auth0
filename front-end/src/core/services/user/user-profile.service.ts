import { ApiService } from '@/core/services/api.service';
import { UpdateUserProfileRequest, UserProfileResponse } from '@/core/models/user/user.types';

export class UserProfileService {
  private static readonly BASE_URL = '/users/profile';

  static async getProfile(): Promise<UserProfileResponse> {
    const response = await ApiService.get<UserProfileResponse>(this.BASE_URL);
    return response.data;
  }

  static async updateProfile(data: UpdateUserProfileRequest): Promise<UserProfileResponse> {
    const response = await ApiService.put<UserProfileResponse>(this.BASE_URL, data);
    return response.data;
  }
}
