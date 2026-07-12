// ============================================================
// Employee Service
// ============================================================

import { api } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { Employee } from '@/types';

export const employeeService = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    api.get<Employee[]>(ENDPOINTS.EMPLOYEES.LIST, { params }),

  details: (id: string) =>
    api.get<Employee>(ENDPOINTS.EMPLOYEES.DETAILS(id)),

  create: (data: Partial<Employee>) =>
    api.post<Employee>(ENDPOINTS.EMPLOYEES.CREATE, data),

  update: (id: string, data: Partial<Employee>) =>
    api.put<Employee>(ENDPOINTS.EMPLOYEES.UPDATE(id), data),

  delete: (id: string) =>
    api.delete<void>(ENDPOINTS.EMPLOYEES.DELETE(id)),

  getAssets: (id: string) =>
    api.get<Record<string, unknown>[]>(ENDPOINTS.EMPLOYEES.ASSETS(id)),

  getActivity: (id: string) =>
    api.get<Record<string, unknown>[]>(ENDPOINTS.EMPLOYEES.ACTIVITY(id)),
};