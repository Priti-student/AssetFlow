import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

export const profileRouter = Router();
profileRouter.use(authenticate);

profileRouter.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id }, include: { employee: { include: { department: true } } } });
    const { password: _, ...userWithoutPassword } = user!;
    res.json({ success: true, data: userWithoutPassword });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

profileRouter.put('/', async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, avatar } = req.body;
    const user = await prisma.user.update({ where: { id: req.user!.id }, data: { firstName, lastName, avatar } });
    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, data: userWithoutPassword });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

profileRouter.post('/change-password', async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found', code: 'NOT_FOUND' });
    
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return res.status(400).json({ success: false, message: 'Current password is incorrect', code: 'INVALID_PASSWORD' });

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: req.user!.id }, data: { password: hashedPassword } });
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

profileRouter.post('/avatar', async (req: AuthRequest, res: Response) => {
  try {
    const { avatar } = req.body;
    const user = await prisma.user.update({ where: { id: req.user!.id }, data: { avatar } });
    res.json({ success: true, data: { avatar: user.avatar } });
  } catch (error) { res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' }); }
});

profileRouter.get('/preferences', async (_req: AuthRequest, res: Response) => {
  res.json({ success: true, data: { theme: 'light', notifications: true, language: 'en' } });
});

profileRouter.put('/preferences', async (_req: AuthRequest, res: Response) => {
  res.json({ success: true, message: 'Preferences updated' });
});