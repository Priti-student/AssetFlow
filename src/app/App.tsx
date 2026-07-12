import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Providers } from '@/providers';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/features/authentication/pages/LoginPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { DepartmentsPage } from '@/features/organization/pages/DepartmentsPage';
import { EmployeesPage } from '@/features/organization/pages/EmployeesPage';
import { AssetDirectoryPage } from '@/features/assets/pages/AssetDirectoryPage';
import { AllocationPage } from '@/features/allocation/pages/AllocationPage';
import { TransfersPage } from '@/features/transfers/pages/TransfersPage';
import { BookingsPage } from '@/features/booking/pages/BookingsPage';
import { MaintenancePage } from '@/features/maintenance/pages/MaintenancePage';
import { AuditPage } from '@/features/audit/pages/AuditPage';
import { ReportsPage } from '@/features/reports/pages/ReportsPage';
import { NotificationsPage } from '@/features/notifications/pages/NotificationsPage';
import { SettingsPage } from '@/features/settings/pages/SettingsPage';
import { ProfilePage } from '@/features/profile/pages/ProfilePage';
import { HelpCenterPage } from '@/features/help/pages/HelpCenterPage';
import { ROUTES } from '@/constants';

export function App() {
  return (
    <BrowserRouter>
      <Providers>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path={ROUTES.ORGANIZATION.ROOT} element={<DepartmentsPage />} />
            <Route path={ROUTES.ORGANIZATION.DEPARTMENTS} element={<DepartmentsPage />} />
            <Route path={ROUTES.ORGANIZATION.EMPLOYEES} element={<EmployeesPage />} />
            <Route path={ROUTES.ASSETS.ROOT} element={<AssetDirectoryPage />} />
            <Route path={ROUTES.ALLOCATION.ROOT} element={<AllocationPage />} />
            <Route path={ROUTES.TRANSFERS} element={<TransfersPage />} />
            <Route path={ROUTES.BOOKINGS.ROOT} element={<BookingsPage />} />
            <Route path={ROUTES.MAINTENANCE.ROOT} element={<MaintenancePage />} />
            <Route path={ROUTES.AUDIT.ROOT} element={<AuditPage />} />
            <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
            <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.HELP} element={<HelpCenterPage />} />
          </Route>

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Providers>
    </BrowserRouter>
  );
}