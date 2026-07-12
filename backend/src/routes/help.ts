import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';

export const helpRouter = Router();
helpRouter.use(authenticate);

helpRouter.get('/articles', (_req: AuthRequest, res: Response) => {
  res.json({ success: true, data: [] });
});

helpRouter.get('/articles/:id', (_req: AuthRequest, res: Response) => {
  res.json({ success: true, data: null });
});

helpRouter.get('/search', (_req: AuthRequest, res: Response) => {
  res.json({ success: true, data: [] });
});

helpRouter.post('/contact', (_req: AuthRequest, res: Response) => {
  res.json({ success: true, message: 'Message sent' });
});

helpRouter.post('/feedback', (_req: AuthRequest, res: Response) => {
  res.json({ success: true, message: 'Feedback submitted' });
});

helpRouter.get('/faq', (_req: AuthRequest, res: Response) => {
  res.json({ success: true, data: [] });
});