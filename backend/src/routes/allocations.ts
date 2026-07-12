import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

export const allocationRouter = Router();
allocationRouter.use(authenticate);

allocationRouter.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.employeeId) where.employeeId = req.query.employeeId;

    const [allocations, total] = await Promise.all([
      prisma.allocation.findMany({
        skip, take: limit, where,
        include: { asset: { include: { category: true } }, employee: true, department: true, allocatedBy: { select: { id: true, firstName: true, lastName: true } } },
        orderBy: { allocatedAt: 'desc' },
      }),
      prisma.allocation.count({ where }),
    ]);
    res.json({ success: true, data: allocations, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

allocationRouter.get('/active', async (req: AuthRequest, res: Response) => {
  try {
    const allocations = await prisma.allocation.findMany({
      where: { status: 'active' },
      include: { asset: { include: { category: true } }, employee: true, department: true },
      orderBy: { allocatedAt: 'desc' },
    });
    res.json({ success: true, data: allocations });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

allocationRouter.get('/history', async (_req: AuthRequest, res: Response) => {
  try {
    const allocations = await prisma.allocation.findMany({
      where: { status: { in: ['returned', 'overdue'] } },
      include: { asset: { include: { category: true } }, employee: true },
      orderBy: { allocatedAt: 'desc' },
      take: 100,
    });
    res.json({ success: true, data: allocations });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

allocationRouter.get('/overdue', async (_req: AuthRequest, res: Response) => {
  try {
    const allocations = await prisma.allocation.findMany({
      where: { status: 'overdue', expectedReturnDate: { lt: new Date() } },
      include: { asset: { include: { category: true } }, employee: true, department: true },
    });
    res.json({ success: true, data: allocations });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

allocationRouter.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const allocation = await prisma.allocation.findUnique({
      where: { id: req.params.id },
      include: { asset: { include: { category: true } }, employee: { include: { department: true } }, department: true, allocatedBy: { select: { id: true, firstName: true, lastName: true } } },
    });
    if (!allocation) return res.status(404).json({ success: false, message: 'Allocation not found', code: 'NOT_FOUND' });
    res.json({ success: true, data: allocation });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

allocationRouter.post('/', authorize('admin', 'asset_manager'), async (req: AuthRequest, res: Response) => {
  try {
    const { assetId, employeeId, departmentId, expectedReturnDate, notes } = req.body;
    const allocation = await prisma.allocation.create({
      data: { assetId, employeeId, departmentId, expectedReturnDate: expectedReturnDate ? new Date(expectedReturnDate) : null, notes, allocatedById: req.user!.id },
      include: { asset: true, employee: true, department: true },
    });
    await prisma.asset.update({ where: { id: assetId }, data: { status: 'allocated', currentHolderId: employeeId } });
    res.status(201).json({ success: true, data: allocation });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

allocationRouter.post('/:id/return', authorize('admin', 'asset_manager'), async (req: AuthRequest, res: Response) => {
  try {
    const allocation = await prisma.allocation.update({
      where: { id: req.params.id },
      data: { status: 'returned', returnedAt: new Date() },
    });
    await prisma.asset.update({ where: { id: allocation.assetId }, data: { status: 'available', currentHolderId: null } });
    res.json({ success: true, data: allocation });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});