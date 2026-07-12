// ============================================================
// Booking Service
// ============================================================

import { api } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { Booking } from '@/types';

export const bookingService = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    api.get<Booking[]>(ENDPOINTS.BOOKINGS.LIST, { params }),

  details: (id: string) =>
    api.get<Booking>(ENDPOINTS.BOOKINGS.DETAILS(id)),

  create: (data: Partial<Booking>) =>
    api.post<Booking>(ENDPOINTS.BOOKINGS.CREATE, data),

  approve: (id: string, data?: Record<string, unknown>) =>
    api.post<Booking>(ENDPOINTS.BOOKINGS.APPROVE(id), data),

  reject: (id: string, data?: Record<string, unknown>) =>
    api.post<Booking>(ENDPOINTS.BOOKINGS.REJECT(id), data),

  cancel: (id: string, data?: Record<string, unknown>) =>
    api.post<Booking>(ENDPOINTS.BOOKINGS.CANCEL(id), data),

  getCalendar: (params?: Record<string, string | number | boolean | undefined>) =>
    api.get<Booking[]>(ENDPOINTS.BOOKINGS.CALENDAR, { params }),

  checkConflict: (data: { assetId: string; startDate: string; endDate: string }) =>
    api.post<{ hasConflict: boolean; conflicts: Booking[] }>(ENDPOINTS.BOOKINGS.CHECK_CONFLICT, data),

  getToday: () => api.get<Booking[]>(ENDPOINTS.BOOKINGS.TODAY),

  getUpcoming: (params?: Record<string, string | number | boolean | undefined>) =>
    api.get<Booking[]>(ENDPOINTS.BOOKINGS.UPCOMING, { params }),
};