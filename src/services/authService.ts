// ============================================================
// Auth Service
// ============================================================

import { api } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { User, LoginCredentials, ApiResponse } from '@/types';

export const authService = {
  login: (credentials: LoginCredentials) =>
    api.post<{ user: User; accessToken: string; refreshToken: string }>(
      ENDPOINTS.AUTH.LOGIN,
      credentials
    ),

  register: (data: Partial<User> & { password: string }) =>
    api.post<{ user: User; accessToken: string; refreshToken: string }>(
      ENDPOINTS.AUTH.REGISTER,
      data
    ),

  logout: () => api.post<void>(ENDPOINTS.AUTH.LOGOUT),

  refreshToken: (refreshToken: string) =>
    api.post<{ accessToken: string; refreshToken: string }>(
      ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    ),

  forgotPassword: (email: string) =>
    api.post<{ message: string }>(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),

  resetPassword: (token: string, password: string) =>
    api.post<{ message: string }>(ENDPOINTS.AUTH.RESET_PASSWORD, { token, password }),

  verifyEmail: (token: string) =>
    api.post<{ message: string }>(ENDPOINTS.AUTH.VERIFY_EMAIL, { token }),

  getProfile: () => api.get<User>(ENDPOINTS.AUTH.PROFILE),

  updateProfile: (data: Partial<User>) =>
    api.put<User>(ENDPOINTS.AUTH.PROFILE, data),
};