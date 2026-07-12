import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

export const maintenanceRouter = Router();
maintenanceRouter.use(authenticate);

maintenanceRouter.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.priority) where.priority = req.query.priority;

    const [requests, total] = await Promise.all([
      prisma.maintenanceRequest.findMany({ skip, take: limit, where, include: { asset: { include: { category: true } }, reportedBy: true, assignedTo: true }, orderBy: { createdAt: 'desc' } }),
      prisma.maintenanceRequest.count({ where }),
    ]);
    res.json({ success: true, data: requests, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

maintenanceRouter.get('/pending', async (_req: AuthRequest, res: Response) => {
  try {
    const requests = await prisma.maintenanceRequest.findMany({ where: { status: { in: ['pending_approval', 'approved', 'in_progress', 'waiting_parts'] } }, include: { asset: { include: { category: true } }, reportedBy: true, assignedTo: true }, orderBy: { priority: 'desc' } });
    res.json({ success: true, data: requests });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

maintenanceRouter.get('/history', async (_req: AuthRequest, res: Response) => {
  try {
    const requests = await prisma.maintenanceRequest.findMany({ where: { status: { in: ['resolved', 'closed'] } }, include: { asset: { include: { category: true } }, reportedBy: true, assignedTo: true }, orderBy: { completedAt: 'desc' }, take: 100 });
    res.json({ success: true, data: requests });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

maintenanceRouter.get('/stats', async (_req: AuthRequest, res: Response) => {
  try {
    const [total, byStatus, byPriority] = await Promise.all([
      prisma.maintenanceRequest.count(),
      prisma.maintenanceRequest.groupBy({ by: ['status'], _count: true }),
      prisma.maintenanceRequest.groupBy({ by: ['priority'], _count: true }),
    ]);
    res.json({ success: true, data: { total, byStatus, byPriority } });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

maintenanceRouter.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const request = await prisma.maintenanceRequest.findUnique({ where: { id: req.params.id }, include: { asset: { include: { category: true, department: true } }, reportedBy: { include: { department: true } }, assignedTo: { include: { department: true } } } });
    if (!request) return res.status(404).json({ success: false, message: 'Maintenance request not found', code: 'NOT_FOUND' });
    res.json({ success: true, data: request });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

maintenanceRouter.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const data = { ...req.body, reportedById: req.user!.id };
    const request = await prisma.maintenanceRequest.create({ data, include: { asset: true, reportedBy: true } });
    await prisma.asset.update({ where: { id: req.body.assetId }, data: { status: 'under_maintenance' } });
    res.status(201).json({ success: true, data: request });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

maintenanceRouter.post('/:id/approve', authorize('admin', 'asset_manager'), async (req: AuthRequest, res: Response) => {
  try {
    const request = await prisma.maintenanceRequest.update({ where: { id: req.params.id }, data: { status: 'approved' } });
    res.json({ success: true, data: request });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

maintenanceRouter.post('/:id/assign', authorize('admin', 'asset_manager'), async (req: AuthRequest, res: Response) => {
  try {
    const request = await prisma.maintenanceRequest.update({ where: { id: req.params.id }, data: { assignedToId: req.body.assignedToId, status: 'approved' } });
    res.json({ success: true, data: request });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

maintenanceRouter.post('/:id/start', authorize('admin', 'asset_manager', 'technician'), async (req: AuthRequest, res: Response) => {
  try {
    const request = await prisma.maintenanceRequest.update({ where: { id: req.params.id }, data: { status: 'in_progress' } });
    res.json({ success: true, data: request });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

maintenanceRouter.post('/:id/complete', authorize('admin', 'asset_manager', 'technician'), async (req: AuthRequest, res: Response) => {
  try {
    const { resolution, cost, parts } = req.body;
    const request = await prisma.maintenanceRequest.update({ where: { id: req.params.id }, data: { status: 'resolved', resolution, cost, parts: parts || [], completedAt: new Date() } });
    await prisma.asset.update({ where: { id: request.assetId }, data: { status: 'available' } });
    res.json({ success: true, data: request });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

maintenanceRouter.post('/:id/close', authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const request = await prisma.maintenanceRequest.update({ where: { id: req.params.id }, data: { status: 'closed' } });
    res.json({ success: true, data: request });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});