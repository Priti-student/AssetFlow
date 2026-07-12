import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

export const transferRouter = Router();
transferRouter.use(authenticate);

transferRouter.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (req.query.status) where.status = req.query.status;

    const [transfers, total] = await Promise.all([
      prisma.transferRequest.findMany({ skip, take: limit, where, include: { asset: { include: { category: true } }, fromEmployee: true, toEmployee: true, fromDepartment: true, toDepartment: true, requestedBy: { select: { id: true, firstName: true, lastName: true } }, approvedBy: { select: { id: true, firstName: true, lastName: true } } }, orderBy: { createdAt: 'desc' } }),
      prisma.transferRequest.count({ where }),
    ]);
    res.json({ success: true, data: transfers, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

transferRouter.get('/pending', async (_req: AuthRequest, res: Response) => {
  try {
    const transfers = await prisma.transferRequest.findMany({ where: { status: 'pending' }, include: { asset: { include: { category: true } }, fromEmployee: true, toEmployee: true, fromDepartment: true, toDepartment: true, requestedBy: { select: { id: true, firstName: true, lastName: true } } }, orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: transfers });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

transferRouter.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const transfer = await prisma.transferRequest.findUnique({ where: { id: req.params.id }, include: { asset: { include: { category: true, images: { where: { isPrimary: true }, take: 1 } } }, fromEmployee: { include: { department: true } }, toEmployee: { include: { department: true } }, fromDepartment: true, toDepartment: true, requestedBy: { select: { id: true, firstName: true, lastName: true } }, approvedBy: { select: { id: true, firstName: true, lastName: true } } } });
    if (!transfer) return res.status(404).json({ success: false, message: 'Transfer not found', code: 'NOT_FOUND' });
    res.json({ success: true, data: transfer });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

transferRouter.post('/', authorize('admin', 'asset_manager'), async (req: AuthRequest, res: Response) => {
  try {
    const data = { ...req.body, requestedById: req.user!.id };
    const transfer = await prisma.transferRequest.create({ data, include: { asset: true, fromEmployee: true, toEmployee: true } });
    res.status(201).json({ success: true, data: transfer });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

transferRouter.post('/:id/approve', authorize('admin', 'asset_manager', 'department_head'), async (req: AuthRequest, res: Response) => {
  try {
    const transfer = await prisma.transferRequest.update({ where: { id: req.params.id }, data: { status: 'approved', approvedById: req.user!.id } });
    res.json({ success: true, data: transfer });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

transferRouter.post('/:id/reject', authorize('admin', 'asset_manager', 'department_head'), async (req: AuthRequest, res: Response) => {
  try {
    const transfer = await prisma.transferRequest.update({ where: { id: req.params.id }, data: { status: 'rejected', approvedById: req.user!.id } });
    res.json({ success: true, data: transfer });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

transferRouter.post('/:id/complete', authorize('admin', 'asset_manager'), async (req: AuthRequest, res: Response) => {
  try {
    const transfer = await prisma.transferRequest.update({ where: { id: req.params.id }, data: { status: 'completed' }, include: { asset: true, toEmployee: true } });
    await prisma.asset.update({ where: { id: transfer.assetId }, data: { currentHolderId: transfer.toEmployeeId, departmentId: transfer.toDepartmentId } });
    res.json({ success: true, data: transfer });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

transferRouter.post('/:id/cancel', async (req: AuthRequest, res: Response) => {
  try {
    const transfer = await prisma.transferRequest.update({ where: { id: req.params.id }, data: { status: 'cancelled' } });
    res.json({ success: true, data: transfer });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});