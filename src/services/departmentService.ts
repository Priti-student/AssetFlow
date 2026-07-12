// ============================================================
// Department Service
// ============================================================

import { api } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { Department } from '@/types';

export const departmentService = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    api.get<Department[]>(ENDPOINTS.DEPARTMENTS.LIST, { params }),

  details: (id: string) =>
    api.get<Department>(ENDPOINTS.DEPARTMENTS.DETAILS(id)),

  create: (data: Partial<Department>) =>
    api.post<Department>(ENDPOINTS.DEPARTMENTS.CREATE, data),

  update: (id: string, data: Partial<Department>) =>
    api.put<Department>(ENDPOINTS.DEPARTMENTS.UPDATE(id), data),

  delete: (id: string) =>
    api.delete<void>(ENDPOINTS.DEPARTMENTS.DELETE(id)),

  getHierarchy: () =>
    api.get<Department[]>(ENDPOINTS.DEPARTMENTS.HIERARCHY),

  getStats: (id: string) =>
    api.get<Record<string, unknown>>(ENDPOINTS.DEPARTMENTS.STATS(id)),
};