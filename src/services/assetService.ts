// ============================================================
// Asset Service
// ============================================================

import { api } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { Asset, AssetCategory } from '@/types';

export const assetService = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    api.get<Asset[]>(ENDPOINTS.ASSETS.LIST, { params }),

  details: (id: string) =>
    api.get<Asset>(ENDPOINTS.ASSETS.DETAILS(id)),

  create: (data: Partial<Asset>) =>
    api.post<Asset>(ENDPOINTS.ASSETS.CREATE, data),

  update: (id: string, data: Partial<Asset>) =>
    api.put<Asset>(ENDPOINTS.ASSETS.UPDATE(id), data),

  delete: (id: string) =>
    api.delete<void>(ENDPOINTS.ASSETS.DELETE(id)),

  getCategories: () =>
    api.get<AssetCategory[]>(ENDPOINTS.ASSETS.CATEGORIES),

  getStats: () =>
    api.get<Record<string, unknown>>(ENDPOINTS.ASSETS.STATS),

  getHistory: (id: string) =>
    api.get<Record<string, unknown>[]>(ENDPOINTS.ASSETS.HISTORY(id)),

  getTimeline: (id: string) =>
    api.get<Record<string, unknown>[]>(ENDPOINTS.ASSETS.TIMELINE(id)),

  getQR: (id: string) =>
    api.get<{ qrCode: string }>(ENDPOINTS.ASSETS.QR(id)),

  getGallery: (id: string) =>
    api.get<Record<string, unknown>[]>(ENDPOINTS.ASSETS.GALLERY(id)),

  bulkCreate: (assets: Partial<Asset>[]) =>
    api.post<Asset[]>(ENDPOINTS.ASSETS.BULK_CREATE, assets),

  export: (format: string, params?: Record<string, string | number | boolean | undefined>) =>
    api.get<Blob>(ENDPOINTS.ASSETS.EXPORT, { params: { format, ...params } }),
};