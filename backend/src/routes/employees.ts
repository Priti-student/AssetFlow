import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

export const employeeRouter = Router();
employeeRouter.use(authenticate);

employeeRouter.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (req.query.departmentId) where.departmentId = req.query.departmentId;
    if (req.query.search) {
      where.OR = [
        { firstName: { contains: req.query.search as string, mode: 'insensitive' } },
        { lastName: { contains: req.query.search as string, mode: 'insensitive' } },
        { email: { contains: req.query.search as string, mode: 'insensitive' } },
      ];
    }

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        skip, take: limit,
        where,
        include: { department: true, user: { select: { id: true, email: true, role: true, avatar: true } } },
        orderBy: { firstName: 'asc' },
      }),
      prisma.employee.count({ where }),
    ]);

    res.json({
      success: true, data: employees,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

employeeRouter.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const emp = await prisma.employee.findUnique({
      where: { id: req.params.id },
      include: { department: true, user: { select: { id: true, email: true, role: true, avatar: true } }, currentAssets: { include: { category: true } } },
    });
    if (!emp) return res.status(404).json({ success: false, message: 'Employee not found', code: 'NOT_FOUND' });
    res.json({ success: true, data: emp });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

employeeRouter.post('/', authorize('admin', 'asset_manager'), async (req: AuthRequest, res: Response) => {
  try {
    const emp = await prisma.employee.create({ data: req.body, include: { department: true } });
    res.status(201).json({ success: true, data: emp });
  } catch (error: any) {
    if (error.code === 'P2002') return res.status(409).json({ success: false, message: 'Employee already exists', code: 'DUPLICATE' });
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

employeeRouter.put('/:id', authorize('admin', 'asset_manager'), async (req: AuthRequest, res: Response) => {
  try {
    const emp = await prisma.employee.update({ where: { id: req.params.id }, data: req.body, include: { department: true } });
    res.json({ success: true, data: emp });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

employeeRouter.delete('/:id', authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    await prisma.employee.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Employee deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

employeeRouter.get('/:id/assets', async (req: AuthRequest, res: Response) => {
  try {
    const assets = await prisma.asset.findMany({ where: { currentHolderId: req.params.id }, include: { category: true } });
    res.json({ success: true, data: assets });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

employeeRouter.get('/:id/activity', async (req: AuthRequest, res: Response) => {
  try {
    const emp = await prisma.employee.findUnique({ where: { id: req.params.id } });
    if (!emp) return res.status(404).json({ success: false, message: 'Employee not found', code: 'NOT_FOUND' });
    const activities = await prisma.activityLog.findMany({
      where: { userId: emp.userId },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });
    res.json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});