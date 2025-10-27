import axios, {AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from 'axios';

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

/**
 * Get access token from localStorage
 * This function should be called in client components
 */
const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  // Try localStorage first (set by useAuthToken hook)
  const token = localStorage.getItem('access_token');
  if (token) return token;

  // Fallback to sessionStorage for backward compatibility
  return sessionStorage.getItem('accessToken');
};

/**
 * Create axios instance with base configuration
 */
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      (config as any).metadata = { startTime: new Date() };

      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });

      return config;
    },
    (error: AxiosError) => {
      console.error('[API Request Error]', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Calculate response time
      const config = response.config as any;
      if (config.metadata?.startTime) {
        const endTime = new Date();
        const duration = endTime.getTime() - config.metadata.startTime.getTime();
        console.log(`[API Response] ${config.method?.toUpperCase()} ${config.url} - ${duration}ms`, {
          status: response.status,
          data: response.data,
        });
      }

      return response;
    },
    async (error: AxiosError<ApiError>) => {
      const config = error.config as any;
      const status = error.response?.status;
      const url = config?.url || 'unknown';

      console.error(`[API Error] ${config?.method?.toUpperCase()} ${url}`, {
        status,
        message: error.response?.data?.message || error.message,
        errors: error.response?.data?.errors,
      });

      // Handle different error status codes
      if (status) {
        switch (status) {
          case 403:
            console.warn('[API] 403 Forbidden - Redirecting to access denied page');
            handleForbidden();
            break;

          default:
            console.error(`[API] Unexpected error status: ${status}`);
        }
      } else if (error.code === 'ECONNABORTED') {
        console.error('[API] Request timeout');
      } else if (!error.response) {
        console.error('[API] Network error - Server may be down');
        handleNetworkError();
      }

      return Promise.reject(error);
    }
  );

  return instance;
};


/**
 * Handle 403 Forbidden error
 */
const handleForbidden = () => {
  if (typeof window === 'undefined') return;

  window.location.href = '/access-denied';
};

/**
 * Handle network errors
 */
const handleNetworkError = () => {
  if (typeof window === 'undefined') return;

  window.location.href = '/500?type=network';
};

// Create and export the configured axios instance
export const apiClient = createAxiosInstance();

// Export axios for direct use if needed
export { axios };
