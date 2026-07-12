import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

export const activityLogRouter = Router();
activityLogRouter.use(authenticate);

activityLogRouter.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({ skip, take: limit, include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } }, orderBy: { timestamp: 'desc' } }),
      prisma.activityLog.count(),
    ]);
    res.json({ success: true, data: logs, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

activityLogRouter.get('/export', async (_req: AuthRequest, res: Response) => {
  try {
    const logs = await prisma.activityLog.findMany({ include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } }, orderBy: { timestamp: 'desc' } });
    res.json({ success: true, data: logs });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

activityLogRouter.get('/stats', async (_req: AuthRequest, res: Response) => {
  try {
    const total = await prisma.activityLog.count();
    res.json({ success: true, data: { total } });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});