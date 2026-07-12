import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

export const auditRouter = Router();
auditRouter.use(authenticate);

auditRouter.get('/cycles', async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const [cycles, total] = await Promise.all([
      prisma.auditCycle.findMany({ skip, take: limit, include: { assignedAuditor: true, _count: { select: { results: true } } }, orderBy: { createdAt: 'desc' } }),
      prisma.auditCycle.count(),
    ]);
    res.json({ success: true, data: cycles, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

auditRouter.get('/cycles/:id', async (req: AuthRequest, res: Response) => {
  try {
    const cycle = await prisma.auditCycle.findUnique({ where: { id: req.params.id }, include: { assignedAuditor: { include: { department: true } }, results: { include: { asset: { include: { category: true } }, verifiedBy: { select: { id: true, firstName: true, lastName: true } } } } } });
    if (!cycle) return res.status(404).json({ success: false, message: 'Audit cycle not found', code: 'NOT_FOUND' });
    res.json({ success: true, data: cycle });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

auditRouter.post('/cycles', authorize('admin', 'auditor'), async (req: AuthRequest, res: Response) => {
  try {
    const cycle = await prisma.auditCycle.create({ data: req.body, include: { assignedAuditor: true } });
    const totalAssets = await prisma.asset.count();
    await prisma.auditCycle.update({ where: { id: cycle.id }, data: { totalAssets } });
    res.status(201).json({ success: true, data: cycle });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

auditRouter.put('/cycles/:id', authorize('admin', 'auditor'), async (req: AuthRequest, res: Response) => {
  try {
    const cycle = await prisma.auditCycle.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, data: cycle });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

auditRouter.post('/cycles/:id/close', authorize('admin', 'auditor'), async (req: AuthRequest, res: Response) => {
  try {
    const cycle = await prisma.auditCycle.update({ where: { id: req.params.id }, data: { status: 'closed' } });
    res.json({ success: true, data: cycle });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

auditRouter.get('/cycles/:cycleId/results', async (req: AuthRequest, res: Response) => {
  try {
    const results = await prisma.auditResult.findMany({ where: { auditCycleId: req.params.cycleId }, include: { asset: { include: { category: true } }, verifiedBy: { select: { id: true, firstName: true, lastName: true } } } });
    res.json({ success: true, data: results });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

auditRouter.post('/cycles/:cycleId/verify', authorize('admin', 'auditor'), async (req: AuthRequest, res: Response) => {
  try {
    const { assetId, status, notes } = req.body;
    const result = await prisma.auditResult.create({ data: { auditCycleId: req.params.cycleId, assetId, status: status || 'verified', notes, verifiedById: req.user!.id } });
    const [verified, missing, damaged] = await Promise.all([
      prisma.auditResult.count({ where: { auditCycleId: req.params.cycleId, status: 'verified' } }),
      prisma.auditResult.count({ where: { auditCycleId: req.params.cycleId, status: 'missing' } }),
      prisma.auditResult.count({ where: { auditCycleId: req.params.cycleId, status: 'damaged' } }),
    ]);
    await prisma.auditCycle.update({ where: { id: req.params.cycleId }, data: { verifiedAssets: verified, missingAssets: missing, damagedAssets: damaged } });
    res.status(201).json({ success: true, data: result });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

auditRouter.get('/cycles/:cycleId/discrepancy', async (req: AuthRequest, res: Response) => {
  try {
    const results = await prisma.auditResult.findMany({ where: { auditCycleId: req.params.cycleId, status: { in: ['missing', 'damaged'] } }, include: { asset: { include: { category: true, department: true } }, verifiedBy: { select: { id: true, firstName: true, lastName: true } } } });
    res.json({ success: true, data: results });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

auditRouter.get('/stats', async (_req: AuthRequest, res: Response) => {
  try {
    const [total, byStatus] = await Promise.all([
      prisma.auditCycle.count(),
      prisma.auditCycle.groupBy({ by: ['status'], _count: true }),
    ]);
    res.json({ success: true, data: { total, byStatus } });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});