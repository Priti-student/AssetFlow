// ============================================================
// Dashboard Service
// ============================================================

import { api } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { DashboardStats, ActivityLog } from '@/types';

export const dashboardService = {
  getStats: () => api.get<DashboardStats>(ENDPOINTS.DASHBOARD.STATS),

  getTrends: (period?: string) =>
    api.get<Record<string, unknown>[]>(ENDPOINTS.DASHBOARD.TRENDS, {
      params: { period },
    }),

  getActivities: (limit?: number) =>
    api.get<ActivityLog[]>(ENDPOINTS.DASHBOARD.ACTIVITIES, {
      params: { limit },
    }),

  getKPIs: () => api.get<Record<string, unknown>>(ENDPOINTS.DASHBOARD.KPIS),
};