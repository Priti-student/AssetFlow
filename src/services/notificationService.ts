// ============================================================
// Notification Service
// ============================================================

import { api } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { Notification } from '@/types';

export const notificationService = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    api.get<Notification[]>(ENDPOINTS.NOTIFICATIONS.LIST, { params }),

  markRead: (id: string) =>
    api.post<void>(ENDPOINTS.NOTIFICATIONS.MARK_READ(id)),

  markAllRead: () =>
    api.post<void>(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ),

  archive: (id: string) =>
    api.post<void>(ENDPOINTS.NOTIFICATIONS.ARCHIVE(id)),

  delete: (id: string) =>
    api.delete<void>(ENDPOINTS.NOTIFICATIONS.DELETE(id)),

  getUnreadCount: () =>
    api.get<{ count: number }>(ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT),

  getSettings: () =>
    api.get<Record<string, unknown>>(ENDPOINTS.NOTIFICATIONS.SETTINGS),

  updateSettings: (data: Record<string, unknown>) =>
    api.put<Record<string, unknown>>(ENDPOINTS.NOTIFICATIONS.SETTINGS, data),
};