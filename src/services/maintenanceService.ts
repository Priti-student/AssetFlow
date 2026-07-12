// ============================================================
// Maintenance Service
// ============================================================

import { api } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { MaintenanceRequest } from '@/types';

export const maintenanceService = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    api.get<MaintenanceRequest[]>(ENDPOINTS.MAINTENANCE.LIST, { params }),

  details: (id: string) =>
    api.get<MaintenanceRequest>(ENDPOINTS.MAINTENANCE.DETAILS(id)),

  create: (data: Partial<MaintenanceRequest>) =>
    api.post<MaintenanceRequest>(ENDPOINTS.MAINTENANCE.CREATE, data),

  approve: (id: string, data?: Record<string, unknown>) =>
    api.post<MaintenanceRequest>(ENDPOINTS.MAINTENANCE.APPROVE(id), data),

  assign: (id: string, data?: Record<string, unknown>) =>
    api.post<MaintenanceRequest>(ENDPOINTS.MAINTENANCE.ASSIGN(id), data),

  start: (id: string, data?: Record<string, unknown>) =>
    api.post<MaintenanceRequest>(ENDPOINTS.MAINTENANCE.START(id), data),

  complete: (id: string, data?: Record<string, unknown>) =>
    api.post<MaintenanceRequest>(ENDPOINTS.MAINTENANCE.COMPLETE(id), data),

  close: (id: string, data?: Record<string, unknown>) =>
    api.post<MaintenanceRequest>(ENDPOINTS.MAINTENANCE.CLOSE(id), data),

  getPending: (params?: Record<string, string | number | boolean | undefined>) =>
    api.get<MaintenanceRequest[]>(ENDPOINTS.MAINTENANCE.PENDING, { params }),

  getHistory: (params?: Record<string, string | number | boolean | undefined>) =>
    api.get<MaintenanceRequest[]>(ENDPOINTS.MAINTENANCE.HISTORY, { params }),

  getStats: () =>
    api.get<Record<string, unknown>>(ENDPOINTS.MAINTENANCE.STATS),
};