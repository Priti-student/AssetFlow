// ============================================================
// Allocation Service
// ============================================================

import { api } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { Allocation } from '@/types';

export const allocationService = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    api.get<Allocation[]>(ENDPOINTS.ALLOCATIONS.LIST, { params }),

  details: (id: string) =>
    api.get<Allocation>(ENDPOINTS.ALLOCATIONS.DETAILS(id)),

  create: (data: Partial<Allocation>) =>
    api.post<Allocation>(ENDPOINTS.ALLOCATIONS.CREATE, data),

  return: (id: string, data?: Record<string, unknown>) =>
    api.post<Allocation>(ENDPOINTS.ALLOCATIONS.RETURN(id), data),

  getActive: (params?: Record<string, string | number | boolean | undefined>) =>
    api.get<Allocation[]>(ENDPOINTS.ALLOCATIONS.ACTIVE, { params }),

  getHistory: (params?: Record<string, string | number | boolean | undefined>) =>
    api.get<Allocation[]>(ENDPOINTS.ALLOCATIONS.HISTORY, { params }),

  getOverdue: (params?: Record<string, string | number | boolean | undefined>) =>
    api.get<Allocation[]>(ENDPOINTS.ALLOCATIONS.OVERDUE, { params }),
};