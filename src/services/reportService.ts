// ============================================================
// Report Service
// ============================================================

import { api } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { Report } from '@/types';

export const reportService = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    api.get<Report[]>(ENDPOINTS.REPORTS.LIST, { params }),

  generate: (data: { type: string; format: string; parameters?: Record<string, unknown> }) =>
    api.post<Report>(ENDPOINTS.REPORTS.GENERATE, data),

  download: (id: string) =>
    api.get<Blob>(ENDPOINTS.REPORTS.DOWNLOAD(id)),

  delete: (id: string) =>
    api.delete<void>(ENDPOINTS.REPORTS.DELETE(id)),

  getTemplates: () =>
    api.get<Record<string, unknown>[]>(ENDPOINTS.REPORTS.TEMPLATES),

  schedule: (data: Record<string, unknown>) =>
    api.post<Record<string, unknown>>(ENDPOINTS.REPORTS.SCHEDULE, data),
};