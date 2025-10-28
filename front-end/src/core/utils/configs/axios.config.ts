import axios, {AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from 'axios';

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('access_token');
  if (token) return token;

  return sessionStorage.getItem('accessToken');
};

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      (config as any).metadata = { startTime: new Date() };
      return config;
    },
    (error: AxiosError) => {
      console.error('[API Request Error]', error);
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
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

const handleForbidden = () => {
  if (typeof window === 'undefined') return;

  window.location.href = '/access-denied';
};

const handleNetworkError = () => {
  if (typeof window === 'undefined') return;

  window.location.href = '/500?type=network';
};

export const apiClient = createAxiosInstance();

export { axios };
