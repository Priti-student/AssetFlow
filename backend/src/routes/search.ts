import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

export const searchRouter = Router();
searchRouter.use(authenticate);

searchRouter.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const q = req.query.q as string;
    if (!q) return res.json({ success: true, data: { assets: [], employees: [], departments: [] } });

    const [assets, employees, departments] = await Promise.all([
      prisma.asset.findMany({ where: { OR: [{ name: { contains: q, mode: 'insensitive' } }, { assetTag: { contains: q, mode: 'insensitive' } }, { serialNumber: { contains: q, mode: 'insensitive' } }] }, take: 10, include: { category: true } }),
      prisma.employee.findMany({ where: { OR: [{ firstName: { contains: q, mode: 'insensitive' } }, { lastName: { contains: q, mode: 'insensitive' } }, { email: { contains: q, mode: 'insensitive' } }] }, take: 10, include: { department: true } }),
      prisma.department.findMany({ where: { name: { contains: q, mode: 'insensitive' } }, take: 10 }),
    ]);

    res.json({ success: true, data: { assets, employees, departments } });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

searchRouter.get('/recent', async (_req: AuthRequest, res: Response) => {
  res.json({ success: true, data: [] });
});

searchRouter.get('/suggestions', async (_req: AuthRequest, res: Response) => {
  res.json({ success: true, data: [] });
});