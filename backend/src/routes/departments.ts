import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

export const departmentRouter = Router();
departmentRouter.use(authenticate);

departmentRouter.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [departments, total] = await Promise.all([
      prisma.department.findMany({
        skip, take: limit,
        include: { head: { select: { id: true, firstName: true, lastName: true, avatar: true } }, parentDepartment: { select: { id: true, name: true } } },
        orderBy: { name: 'asc' },
      }),
      prisma.department.count(),
    ]);

    res.json({
      success: true, data: departments,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

departmentRouter.get('/hierarchy', async (_req: AuthRequest, res: Response) => {
  try {
    const departments = await prisma.department.findMany({
      include: { head: { select: { id: true, firstName: true, lastName: true } }, childDepartments: { include: { head: { select: { id: true, firstName: true, lastName: true } } } } },
    });
    res.json({ success: true, data: departments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

departmentRouter.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const dept = await prisma.department.findUnique({
      where: { id: req.params.id },
      include: { head: true, parentDepartment: true, childDepartments: true, employees: { where: { isActive: true } }, assets: { take: 10 } },
    });
    if (!dept) return res.status(404).json({ success: false, message: 'Department not found', code: 'NOT_FOUND' });
    res.json({ success: true, data: dept });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

departmentRouter.post('/', authorize('admin', 'asset_manager'), async (req: AuthRequest, res: Response) => {
  try {
    const dept = await prisma.department.create({ data: req.body });
    res.status(201).json({ success: true, data: dept });
  } catch (error: any) {
    if (error.code === 'P2002') return res.status(409).json({ success: false, message: 'Code already exists', code: 'DUPLICATE' });
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

departmentRouter.put('/:id', authorize('admin', 'asset_manager'), async (req: AuthRequest, res: Response) => {
  try {
    const dept = await prisma.department.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, data: dept });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

departmentRouter.delete('/:id', authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    await prisma.department.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Department deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

departmentRouter.get('/:id/stats', async (req: AuthRequest, res: Response) => {
  try {
    const [assets, employees, allocations] = await Promise.all([
      prisma.asset.count({ where: { departmentId: req.params.id } }),
      prisma.employee.count({ where: { departmentId: req.params.id, isActive: true } }),
      prisma.allocation.count({ where: { departmentId: req.params.id, status: 'active' } }),
    ]);
    res.json({ success: true, data: { totalAssets: assets, totalEmployees: employees, activeAllocations: allocations } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});