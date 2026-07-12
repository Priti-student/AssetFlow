// ============================================================
// API Client - Axios-like fetch wrapper with interceptors
// ============================================================

import { useAuthStore } from '@/store/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8069';
const API_TIMEOUT = 30000;

interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  endpoint: string,
  config: ApiRequestConfig = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', headers = {}, body, params, signal } = config;

  const { accessToken, refreshToken, updateTokens, logout } = useAuthStore.getState();

  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (accessToken) {
    defaultHeaders['Authorization'] = `Bearer ${accessToken}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url.toString(), {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: signal || controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle token refresh
    if (response.status === 401 && refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          updateTokens(refreshData.accessToken, refreshData.refreshToken);
          defaultHeaders['Authorization'] = `Bearer ${refreshData.accessToken}`;

          const retryResponse = await fetch(url.toString(), {
            method,
            headers: defaultHeaders,
            body: body ? JSON.stringify(body) : undefined,
          });

          if (!retryResponse.ok) {
            const errorData = await retryResponse.json().catch(() => ({}));
            throw new ApiError(
              retryResponse.status,
              errorData.code || 'RETRY_FAILED',
              errorData.message || 'Request failed after token refresh'
            );
          }

          return retryResponse.json();
        } else {
          logout();
          throw new ApiError(401, 'SESSION_EXPIRED', 'Session expired. Please login again.');
        }
      } catch (refreshError) {
        if (refreshError instanceof ApiError) throw refreshError;
        logout();
        throw new ApiError(401, 'SESSION_EXPIRED', 'Session expired. Please login again.');
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.code || 'REQUEST_FAILED',
        errorData.message || `Request failed with status ${response.status}`,
        errorData.details
      );
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(408, 'TIMEOUT', 'Request timed out');
    }
    throw new ApiError(0, 'NETWORK_ERROR', 'Network error. Please check your connection.');
  }
}

// Convenience methods
export const api = {
  get: <T>(endpoint: string, config?: ApiRequestConfig) =>
    request<T>(endpoint, { ...config, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, config?: ApiRequestConfig) =>
    request<T>(endpoint, { ...config, method: 'POST', body }),

  put: <T>(endpoint: string, body?: unknown, config?: ApiRequestConfig) =>
    request<T>(endpoint, { ...config, method: 'PUT', body }),

  patch: <T>(endpoint: string, body?: unknown, config?: ApiRequestConfig) =>
    request<T>(endpoint, { ...config, method: 'PATCH', body }),

  delete: <T>(endpoint: string, config?: ApiRequestConfig) =>
    request<T>(endpoint, { ...config, method: 'DELETE' }),
};

export { ApiError };
