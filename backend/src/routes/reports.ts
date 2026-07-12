import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

export const reportRouter = Router();
reportRouter.use(authenticate);

reportRouter.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const reports = await prisma.report.findMany({ where: { generatedById: req.user!.id }, include: { generatedBy: { select: { id: true, firstName: true, lastName: true } } }, orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: reports });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

reportRouter.post('/generate', async (req: AuthRequest, res: Response) => {
  try {
    const report = await prisma.report.create({ data: { ...req.body, generatedById: req.user!.id } });
    res.status(201).json({ success: true, data: report });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

reportRouter.get('/:id/download', async (req: AuthRequest, res: Response) => {
  try {
    const report = await prisma.report.findUnique({ where: { id: req.params.id } });
    if (!report) return res.status(404).json({ success: false, message: 'Report not found', code: 'NOT_FOUND' });
    res.json({ success: true, data: report });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

reportRouter.delete('/:id', authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    await prisma.report.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Report deleted' });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

reportRouter.get('/templates', async (_req: AuthRequest, res: Response) => {
  res.json({ success: true, data: [] });
});

reportRouter.post('/schedule', async (_req: AuthRequest, res: Response) => {
  res.json({ success: true, message: 'Schedule feature coming soon' });
});