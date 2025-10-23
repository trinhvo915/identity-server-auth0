import { apiClient } from '@/core/utils/configs/axios.config';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Base API Service class
 * Provides common HTTP methods for API calls
 */
export class ApiService {
  /**
   * GET request
   * @param url - API endpoint
   * @param config - Optional axios config (params, headers, etc.)
   */
  static async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return apiClient.get<T>(url, config);
  }

  /**
   * POST request
   * @param url - API endpoint
   * @param data - Request body
   * @param config - Optional axios config
   */
  static async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return apiClient.post<T>(url, data, config);
  }

  /**
   * PUT request
   * @param url - API endpoint
   * @param data - Request body
   * @param config - Optional axios config
   */
  static async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return apiClient.put<T>(url, data, config);
  }

  /**
   * PATCH request
   * @param url - API endpoint
   * @param data - Request body
   * @param config - Optional axios config
   */
  static async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return apiClient.patch<T>(url, data, config);
  }

  /**
   * DELETE request
   * @param url - API endpoint
   * @param config - Optional axios config
   */
  static async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return apiClient.delete<T>(url, config);
  }

  /**
   * GET request without authentication
   * Removes Authorization header for public endpoints
   */
  static async getPublic<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const publicConfig = {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: undefined, // Remove auth header
      },
    };
    return apiClient.get<T>(url, publicConfig);
  }

  /**
   * POST request without authentication
   * Removes Authorization header for public endpoints
   */
  static async postPublic<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const publicConfig = {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: undefined, // Remove auth header
      },
    };
    return apiClient.post<T>(url, data, publicConfig);
  }

  /**
   * Upload file(s)
   * @param url - API endpoint
   * @param formData - FormData containing file(s)
   * @param onUploadProgress - Progress callback
   */
  static async upload<T = any>(
    url: string,
    formData: FormData,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<AxiosResponse<T>> {
    return apiClient.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  }

  /**
   * Download file
   * @param url - API endpoint
   * @param filename - Optional filename for the downloaded file
   */
  static async download(url: string, filename?: string): Promise<void> {
    const response = await apiClient.get(url, {
      responseType: 'blob',
    });

    // Create blob link to download
    const blob = new Blob([response.data]);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);

    // Extract filename from Content-Disposition header or use provided filename
    const contentDisposition = response.headers['content-disposition'];
    const filenameMatch = contentDisposition?.match(/filename="?(.+)"?/);
    link.download = filename || filenameMatch?.[1] || 'download';

    link.click();
    window.URL.revokeObjectURL(link.href);
  }
}

/**
 * Export the configured axios instance for direct use if needed
 */
export { apiClient };
