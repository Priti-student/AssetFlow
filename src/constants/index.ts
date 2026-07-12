export const APP_NAME = 'AssetFlow';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Enterprise Asset & Resource Management System';

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  PAGE_SIZES: [10, 20, 50, 100],
} as const;

export const ASSET_STATUS_COLORS: Record<string, string> = {
  available: 'bg-success/10 text-success border-success/20',
  allocated: 'bg-primary/10 text-primary border-primary/20',
  reserved: 'bg-accent/10 text-accent border-accent/20',
  under_maintenance: 'bg-warning/10 text-warning border-warning/20',
  lost: 'bg-destructive/10 text-destructive border-destructive/20',
  retired: 'bg-muted text-muted-foreground border-muted-foreground/20',
  disposed: 'bg-destructive/10 text-destructive border-destructive/20',
} as const;

export const ASSET_CONDITION_COLORS: Record<string, string> = {
  new: 'bg-success/10 text-success',
  good: 'bg-primary/10 text-primary',
  fair: 'bg-warning/10 text-warning',
  poor: 'bg-destructive/10 text-destructive',
  damaged: 'bg-destructive/20 text-destructive',
} as const;

export const BOOKING_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-warning/10 text-warning',
  approved: 'bg-success/10 text-success',
  rejected: 'bg-destructive/10 text-destructive',
  upcoming: 'bg-accent/10 text-accent',
  ongoing: 'bg-primary/10 text-primary',
  completed: 'bg-muted text-muted-foreground',
  cancelled: 'bg-destructive/10 text-destructive',
} as const;

export const MAINTENANCE_STATUS_COLORS: Record<string, string> = {
  pending_approval: 'bg-warning/10 text-warning',
  approved: 'bg-accent/10 text-accent',
  in_progress: 'bg-primary/10 text-primary',
  waiting_parts: 'bg-warning/10 text-warning',
  resolved: 'bg-success/10 text-success',
  closed: 'bg-muted text-muted-foreground',
} as const;

export const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-success/10 text-success',
  medium: 'bg-warning/10 text-warning',
  high: 'bg-destructive/10 text-destructive',
  critical: 'bg-destructive/20 text-destructive',
} as const;

export const ROUTES = {
  AUTH: {
    LOGIN: '/login',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    VERIFY_EMAIL: '/verify-email',
  },
  DASHBOARD: '/dashboard',
  ASSETS: {
    ROOT: '/assets',
    DIRECTORY: '/assets',
    DETAILS: (id: string) => `/assets/${id}`,
    CREATE: '/assets/create',
    QR: (id: string) => `/assets/${id}/qr`,
    GALLERY: (id: string) => `/assets/${id}/gallery`,
    HISTORY: (id: string) => `/assets/${id}/history`,
  },
  ORGANIZATION: {
    ROOT: '/organization',
    DEPARTMENTS: '/organization/departments',
    EMPLOYEES: '/organization/employees',
    ROLES: '/organization/roles',
    PERMISSIONS: '/organization/permissions',
  },
  ALLOCATION: {
    ROOT: '/allocation',
    ACTIVE: '/allocation/active',
    HISTORY: '/allocation/history',
  },
  TRANSFERS: '/transfers',
  BOOKINGS: {
    ROOT: '/bookings',
    CALENDAR: '/bookings/calendar',
  },
  MAINTENANCE: {
    ROOT: '/maintenance',
    REQUESTS: '/maintenance/requests',
    HISTORY: '/maintenance/history',
  },
  AUDIT: {
    ROOT: '/audit',
    CYCLES: '/audit/cycles',
    RESULTS: '/audit/results',
  },
  REPORTS: '/reports',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  HELP: '/help',
} as const;

export const SIDEBAR_ITEMS = [
  { icon: 'LayoutDashboard', label: 'Dashboard', path: ROUTES.DASHBOARD },
  { icon: 'Building2', label: 'Organization', path: ROUTES.ORGANIZATION.ROOT },
  { icon: 'Package', label: 'Assets', path: ROUTES.ASSETS.ROOT },
  { icon: 'ArrowRightLeft', label: 'Allocation', path: ROUTES.ALLOCATION.ROOT },
  { icon: 'GitCompareArrows', label: 'Transfers', path: ROUTES.TRANSFERS },
  { icon: 'CalendarCheck', label: 'Bookings', path: ROUTES.BOOKINGS.ROOT },
  { icon: 'Wrench', label: 'Maintenance', path: ROUTES.MAINTENANCE.ROOT },
  { icon: 'ClipboardCheck', label: 'Audit', path: ROUTES.AUDIT.ROOT },
  { icon: 'BarChart3', label: 'Reports', path: ROUTES.REPORTS },
  { icon: 'Bell', label: 'Notifications', path: ROUTES.NOTIFICATIONS },
  { icon: 'Settings', label: 'Settings', path: ROUTES.SETTINGS },
  { icon: 'HelpCircle', label: 'Help', path: ROUTES.HELP },
] as const;

export const QUERY_KEYS = {
  ASSETS: 'assets',
  ASSET: 'asset',
  CATEGORIES: 'categories',
  DEPARTMENTS: 'departments',
  EMPLOYEES: 'employees',
  ALLOCATIONS: 'allocations',
  TRANSFERS: 'transfers',
  BOOKINGS: 'bookings',
  MAINTENANCE: 'maintenance',
  AUDITS: 'audits',
  NOTIFICATIONS: 'notifications',
  ACTIVITY_LOGS: 'activity-logs',
  REPORTS: 'reports',
  DASHBOARD: 'dashboard',
  PROFILE: 'profile',
} as const;