import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

export const assetRouter = Router();
assetRouter.use(authenticate);

assetRouter.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (req.query.categoryId) where.categoryId = req.query.categoryId;
    if (req.query.departmentId) where.departmentId = req.query.departmentId;
    if (req.query.status) where.status = req.query.status;
    if (req.query.condition) where.condition = req.query.condition;
    if (req.query.search) {
      where.OR = [
        { name: { contains: req.query.search as string, mode: 'insensitive' } },
        { assetTag: { contains: req.query.search as string, mode: 'insensitive' } },
        { serialNumber: { contains: req.query.search as string, mode: 'insensitive' } },
      ];
    }

    const [assets, total] = await Promise.all([
      prisma.asset.findMany({
        skip, take: limit,
        where,
        include: {
          category: true, department: true,
          currentHolder: { select: { id: true, firstName: true, lastName: true } },
          images: { where: { isPrimary: true }, take: 1 },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.asset.count({ where }),
    ]);

    res.json({
      success: true, data: assets,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

assetRouter.get('/categories', async (_req: AuthRequest, res: Response) => {
  try {
    const categories = await prisma.assetCategory.findMany({
      include: { children: true, _count: { select: { assets: true } } },
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

assetRouter.get('/stats', async (_req: AuthRequest, res: Response) => {
  try {
    const [total, byStatus, byCondition, byCategory] = await Promise.all([
      prisma.asset.count(),
      prisma.asset.groupBy({ by: ['status'], _count: true }),
      prisma.asset.groupBy({ by: ['condition'], _count: true }),
      prisma.assetCategory.findMany({ include: { _count: { select: { assets: true } } } }),
    ]);
    res.json({ success: true, data: { total, byStatus, byCondition, byCategory } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

assetRouter.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const asset = await prisma.asset.findUnique({
      where: { id: req.params.id },
      include: {
        category: true, department: true,
        currentHolder: { include: { department: true } },
        images: true, documents: true,
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        updatedBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });
    if (!asset) return res.status(404).json({ success: false, message: 'Asset not found', code: 'NOT_FOUND' });
    res.json({ success: true, data: asset });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

assetRouter.post('/', authorize('admin', 'asset_manager'), async (req: AuthRequest, res: Response) => {
  try {
    const data = { ...req.body, createdById: req.user!.id, updatedById: req.user!.id };
    const asset = await prisma.asset.create({ data, include: { category: true, department: true } });
    res.status(201).json({ success: true, data: asset });
  } catch (error: any) {
    if (error.code === 'P2002') return res.status(409).json({ success: false, message: 'Asset tag or serial already exists', code: 'DUPLICATE' });
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

assetRouter.put('/:id', authorize('admin', 'asset_manager'), async (req: AuthRequest, res: Response) => {
  try {
    const data = { ...req.body, updatedById: req.user!.id };
    const asset = await prisma.asset.update({ where: { id: req.params.id }, data, include: { category: true, department: true } });
    res.json({ success: true, data: asset });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

assetRouter.delete('/:id', authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    await prisma.asset.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Asset deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

assetRouter.get('/:id/qr', async (req: AuthRequest, res: Response) => {
  try {
    const asset = await prisma.asset.findUnique({ where: { id: req.params.id }, select: { qrCode: true } });
    if (!asset) return res.status(404).json({ success: false, message: 'Asset not found', code: 'NOT_FOUND' });
    res.json({ success: true, data: { qrCode: asset.qrCode } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

assetRouter.get('/:id/gallery', async (req: AuthRequest, res: Response) => {
  try {
    const images = await prisma.assetImage.findMany({ where: { assetId: req.params.id }, orderBy: { uploadedAt: 'desc' } });
    res.json({ success: true, data: images });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

assetRouter.get('/:id/documents', async (req: AuthRequest, res: Response) => {
  try {
    const docs = await prisma.assetDocument.findMany({ where: { assetId: req.params.id } });
    res.json({ success: true, data: docs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

assetRouter.get('/:id/history', async (req: AuthRequest, res: Response) => {
  try {
    const history = await prisma.activityLog.findMany({
      where: { entity: 'asset', entityId: req.params.id },
      include: { user: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { timestamp: 'desc' },
    });
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

assetRouter.get('/:id/timeline', async (req: AuthRequest, res: Response) => {
  try {
    const [allocations, transfers, maintenance, bookings] = await Promise.all([
      prisma.allocation.findMany({ where: { assetId: req.params.id }, include: { employee: true }, orderBy: { allocatedAt: 'desc' } }),
      prisma.transferRequest.findMany({ where: { assetId: req.params.id }, include: { fromEmployee: true, toEmployee: true }, orderBy: { createdAt: 'desc' } }),
      prisma.maintenanceRequest.findMany({ where: { assetId: req.params.id }, orderBy: { createdAt: 'desc' } }),
      prisma.booking.findMany({ where: { assetId: req.params.id }, orderBy: { createdAt: 'desc' } }),
    ]);
    res.json({ success: true, data: { allocations, transfers, maintenance, bookings } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

assetRouter.post('/bulk', authorize('admin', 'asset_manager'), async (req: AuthRequest, res: Response) => {
  try {
    const assets = req.body.assets || req.body;
    const created = await prisma.asset.createMany({
      data: assets.map((a: any) => ({ ...a, createdById: req.user!.id, updatedById: req.user!.id })),
      skipDuplicates: true,
    });
    res.status(201).json({ success: true, data: { count: created.count } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

assetRouter.get('/export', async (req: AuthRequest, res: Response) => {
  try {
    const assets = await prisma.asset.findMany({ include: { category: true, department: true } });
    res.json({ success: true, data: assets });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

assetRouter.post('/import', authorize('admin', 'asset_manager'), async (req: AuthRequest, res: Response) => {
  try {
    res.json({ success: true, message: 'Import feature coming soon' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});