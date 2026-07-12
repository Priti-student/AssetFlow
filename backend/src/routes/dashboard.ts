import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

export const dashboardRouter = Router();
dashboardRouter.use(authenticate);

dashboardRouter.get('/stats', async (_req: AuthRequest, res: Response) => {
  try {
    const [totalAssets, availableAssets, allocatedAssets, underMaintenance, lostAssets, totalDepartments, totalEmployees, overdueReturns, auditsInProgress] = await Promise.all([
      prisma.asset.count(),
      prisma.asset.count({ where: { status: 'available' } }),
      prisma.asset.count({ where: { status: 'allocated' } }),
      prisma.asset.count({ where: { status: 'under_maintenance' } }),
      prisma.asset.count({ where: { status: 'lost' } }),
      prisma.department.count({ where: { isActive: true } }),
      prisma.employee.count({ where: { isActive: true } }),
      prisma.allocation.count({ where: { status: 'overdue' } }),
      prisma.auditCycle.count({ where: { status: 'in_progress' } }),
    ]);

    const expiringWarranty = await prisma.asset.count({
      where: { warrantyEnd: { lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } },
    });

    const bookingsToday = await prisma.booking.count({
      where: { startDate: { lte: new Date() }, endDate: { gte: new Date() } },
    });

    res.json({
      success: true,
      data: {
        totalAssets, availableAssets, allocatedAssets, reservedAssets: 0,
        underMaintenance, pendingTransfers: 0, overdueReturns,
        bookingsToday, auditsInProgress, expiringWarranty, lostAssets,
        totalDepartments, totalEmployees, maintenanceToday: 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

dashboardRouter.get('/trends', async (req: AuthRequest, res: Response) => {
  try {
    const period = req.query.period || 'monthly';
    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

dashboardRouter.get('/activities', async (req: AuthRequest, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const activities = await prisma.activityLog.findMany({
      take: limit,
      orderBy: { timestamp: 'desc' },
      include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
    });
    res.json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

dashboardRouter.get('/kpis', async (_req: AuthRequest, res: Response) => {
  try {
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});