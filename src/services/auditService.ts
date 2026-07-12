// ============================================================
// Audit Service
// ============================================================

import { api } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { AuditCycle, AuditResult } from '@/types';

export const auditService = {
  getCycles: (params?: Record<string, string | number | boolean | undefined>) =>
    api.get<AuditCycle[]>(ENDPOINTS.AUDIT.CYCLES, { params }),

  getCycleDetails: (id: string) =>
    api.get<AuditCycle>(ENDPOINTS.AUDIT.CYCLE_DETAILS(id)),

  createCycle: (data: Partial<AuditCycle>) =>
    api.post<AuditCycle>(ENDPOINTS.AUDIT.CREATE_CYCLE, data),

  updateCycle: (id: string, data: Partial<AuditCycle>) =>
    api.put<AuditCycle>(ENDPOINTS.AUDIT.UPDATE_CYCLE(id), data),

  closeCycle: (id: string, data?: Record<string, unknown>) =>
    api.post<AuditCycle>(ENDPOINTS.AUDIT.CLOSE_CYCLE(id), data),

  getResults: (cycleId: string) =>
    api.get<AuditResult[]>(ENDPOINTS.AUDIT.RESULTS(cycleId)),

  verify: (cycleId: string, data: { assetId: string; status: string; notes?: string }) =>
    api.post<AuditResult>(ENDPOINTS.AUDIT.VERIFY(cycleId), data),

  getDiscrepancy: (cycleId: string) =>
    api.get<Record<string, unknown>[]>(ENDPOINTS.AUDIT.DISCREPANCY(cycleId)),

  getStats: () =>
    api.get<Record<string, unknown>>(ENDPOINTS.AUDIT.STATS),
};