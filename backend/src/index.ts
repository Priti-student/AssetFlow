import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth';
import { dashboardRouter } from './routes/dashboard';
import { departmentRouter } from './routes/departments';
import { employeeRouter } from './routes/employees';
import { assetRouter } from './routes/assets';
import { allocationRouter } from './routes/allocations';
import { transferRouter } from './routes/transfers';
import { bookingRouter } from './routes/bookings';
import { maintenanceRouter } from './routes/maintenance';
import { auditRouter } from './routes/audit';
import { notificationRouter } from './routes/notifications';
import { reportRouter } from './routes/reports';
import { activityLogRouter } from './routes/activityLogs';
import { settingsRouter } from './routes/settings';
import { profileRouter } from './routes/profile';
import { helpRouter } from './routes/help';
import { searchRouter } from './routes/search';

const app = express();
const PORT = process.env.PORT || 8069;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/departments', departmentRouter);
app.use('/api/employees', employeeRouter);
app.use('/api/assets', assetRouter);
app.use('/api/allocations', allocationRouter);
app.use('/api/transfers', transferRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/maintenance', maintenanceRouter);
app.use('/api/audit', auditRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/reports', reportRouter);
app.use('/api/activity-logs', activityLogRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/profile', profileRouter);
app.use('/api/help', helpRouter);
app.use('/api/search', searchRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    code: err.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  console.log(`AssetFlow API server running on port ${PORT}`);
});

export default app;