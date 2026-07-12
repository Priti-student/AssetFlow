import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

export const bookingRouter = Router();
bookingRouter.use(authenticate);

bookingRouter.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (req.query.status) where.status = req.query.status;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({ skip, take: limit, where, include: { asset: { include: { category: true } }, bookedBy: true, approvedBy: { select: { id: true, firstName: true, lastName: true } } }, orderBy: { createdAt: 'desc' } }),
      prisma.booking.count({ where }),
    ]);
    res.json({ success: true, data: bookings, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

bookingRouter.get('/calendar', async (req: AuthRequest, res: Response) => {
  try {
    const startDate = req.query.start ? new Date(req.query.start as string) : new Date();
    const endDate = req.query.end ? new Date(req.query.end as string) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const bookings = await prisma.booking.findMany({ where: { startDate: { gte: startDate }, endDate: { lte: endDate } }, include: { asset: { select: { id: true, name: true } }, bookedBy: { select: { id: true, firstName: true, lastName: true } } } });
    res.json({ success: true, data: bookings });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

bookingRouter.get('/today', async (_req: AuthRequest, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const bookings = await prisma.booking.findMany({ where: { startDate: { lte: tomorrow }, endDate: { gte: today } }, include: { asset: { select: { id: true, name: true } }, bookedBy: { select: { id: true, firstName: true, lastName: true } } } });
    res.json({ success: true, data: bookings });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

bookingRouter.get('/upcoming', async (_req: AuthRequest, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({ where: { startDate: { gte: new Date() }, status: { in: ['approved', 'pending'] } }, include: { asset: { select: { id: true, name: true } }, bookedBy: { select: { id: true, firstName: true, lastName: true } } }, orderBy: { startDate: 'asc' }, take: 20 });
    res.json({ success: true, data: bookings });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

bookingRouter.get('/check-conflict', async (req: AuthRequest, res: Response) => {
  try {
    const { assetId, startDate, endDate, excludeId } = req.query;
    const where: any = { assetId, status: { in: ['approved', 'pending', 'ongoing'] }, startDate: { lte: new Date(endDate as string) }, endDate: { gte: new Date(startDate as string) } };
    if (excludeId) where.id = { not: excludeId as string };
    const conflict = await prisma.booking.findFirst({ where });
    res.json({ success: true, data: { hasConflict: !!conflict } });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

bookingRouter.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const booking = await prisma.booking.findUnique({ where: { id: req.params.id }, include: { asset: { include: { category: true, images: { where: { isPrimary: true }, take: 1 } } }, bookedBy: { include: { department: true } }, approvedBy: { select: { id: true, firstName: true, lastName: true } } } });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found', code: 'NOT_FOUND' });
    res.json({ success: true, data: booking });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

bookingRouter.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const data = { ...req.body, bookedById: req.user!.id };
    const booking = await prisma.booking.create({ data, include: { asset: true, bookedBy: true } });
    res.status(201).json({ success: true, data: booking });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

bookingRouter.post('/:id/approve', authorize('admin', 'asset_manager'), async (req: AuthRequest, res: Response) => {
  try {
    const booking = await prisma.booking.update({ where: { id: req.params.id }, data: { status: 'approved', approvedById: req.user!.id } });
    res.json({ success: true, data: booking });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

bookingRouter.post('/:id/reject', authorize('admin', 'asset_manager'), async (req: AuthRequest, res: Response) => {
  try {
    const booking = await prisma.booking.update({ where: { id: req.params.id }, data: { status: 'rejected', approvedById: req.user!.id } });
    res.json({ success: true, data: booking });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

bookingRouter.post('/:id/cancel', async (req: AuthRequest, res: Response) => {
  try {
    const booking = await prisma.booking.update({ where: { id: req.params.id }, data: { status: 'cancelled' } });
    res.json({ success: true, data: booking });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});