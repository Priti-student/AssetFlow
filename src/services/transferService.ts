// ============================================================
// Transfer Service
// ============================================================

import { api } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { TransferRequest } from '@/types';

export const transferService = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    api.get<TransferRequest[]>(ENDPOINTS.TRANSFERS.LIST, { params }),

  details: (id: string) =>
    api.get<TransferRequest>(ENDPOINTS.TRANSFERS.DETAILS(id)),

  create: (data: Partial<TransferRequest>) =>
    api.post<TransferRequest>(ENDPOINTS.TRANSFERS.CREATE, data),

  approve: (id: string, data?: Record<string, unknown>) =>
    api.post<TransferRequest>(ENDPOINTS.TRANSFERS.APPROVE(id), data),

  reject: (id: string, data?: Record<string, unknown>) =>
    api.post<TransferRequest>(ENDPOINTS.TRANSFERS.REJECT(id), data),

  complete: (id: string, data?: Record<string, unknown>) =>
    api.post<TransferRequest>(ENDPOINTS.TRANSFERS.COMPLETE(id), data),

  cancel: (id: string, data?: Record<string, unknown>) =>
    api.post<TransferRequest>(ENDPOINTS.TRANSFERS.CANCEL(id), data),

  getPending: (params?: Record<string, string | number | boolean | undefined>) =>
    api.get<TransferRequest[]>(ENDPOINTS.TRANSFERS.PENDING, { params }),
};