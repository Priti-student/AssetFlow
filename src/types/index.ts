// ============================================================
// Core Type Definitions for AssetFlow
// ============================================================

// User & Auth Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  department?: Department;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'asset_manager' | 'department_head' | 'employee' | 'technician' | 'auditor';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface Permission {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

// Department Types
export interface Department {
  id: string;
  name: string;
  code: string;
  head?: Employee;
  parentDepartment?: Department;
  description?: string;
  isActive: boolean;
  employeeCount: number;
  assetCount: number;
  createdAt: string;
}

// Employee Types
export interface Employee {
  id: string;
  userId: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  department: Department;
  designation: string;
  joinDate: string;
  isActive: boolean;
}

// Asset Types
export interface Asset {
  id: string;
  assetTag: string;
  name: string;
  category: AssetCategory;
  serialNumber: string;
  manufacturer: string;
  model: string;
  purchaseDate: string;
  purchaseCost: number;
  warrantyStart: string;
  warrantyEnd: string;
  currentHolder?: Employee;
  department: Department;
  location: string;
  qrCode: string;
  barcode: string;
  condition: AssetCondition;
  status: AssetStatus;
  images: AssetImage[];
  documents: AssetDocument[];
  isSharedResource: boolean;
  isBookable: boolean;
  notes?: string;
  lifecycleStatus: LifecycleStatus;
  createdBy: User;
  updatedBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface AssetCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  parent?: AssetCategory;
}

export type AssetCondition = 'new' | 'good' | 'fair' | 'poor' | 'damaged';
export type AssetStatus = 'available' | 'allocated' | 'reserved' | 'under_maintenance' | 'lost' | 'retired' | 'disposed';
export type LifecycleStatus = 'active' | 'inactive' | 'pending_disposal' | 'disposed';

export interface AssetImage {
  id: string;
  url: string;
  isPrimary: boolean;
  uploadedAt: string;
}

export interface AssetDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

// Allocation Types
export interface Allocation {
  id: string;
  asset: Asset;
  employee: Employee;
  department: Department;
  allocatedBy: User;
  allocatedAt: string;
  expectedReturnDate?: string;
  returnedAt?: string;
  status: AllocationStatus;
  notes?: string;
}

export type AllocationStatus = 'active' | 'returned' | 'overdue';

// Transfer Types
export interface TransferRequest {
  id: string;
  asset: Asset;
  fromEmployee: Employee;
  toEmployee: Employee;
  fromDepartment: Department;
  toDepartment: Department;
  requestedBy: User;
  approvedBy?: User;
  status: TransferStatus;
  reason: string;
  createdAt: string;
  updatedAt: string;
}

export type TransferStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';

// Booking Types
export interface Booking {
  id: string;
  asset: Asset;
  bookedBy: Employee;
  startDate: string;
  endDate: string;
  purpose: string;
  status: BookingStatus;
  approvedBy?: User;
  notes?: string;
  createdAt: string;
}

export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

// Maintenance Types
export interface MaintenanceRequest {
  id: string;
  asset: Asset;
  reportedBy: Employee;
  assignedTo?: Employee;
  title: string;
  description: string;
  priority: Priority;
  status: MaintenanceStatus;
  type: MaintenanceType;
  cost?: number;
  parts?: string[];
  resolution?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type MaintenanceStatus = 'pending_approval' | 'approved' | 'in_progress' | 'waiting_parts' | 'resolved' | 'closed';
export type MaintenanceType = 'corrective' | 'preventive' | 'emergency';

// Audit Types
export interface AuditCycle {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: AuditStatus;
  assignedAuditor: Employee;
  totalAssets: number;
  verifiedAssets: number;
  missingAssets: number;
  damagedAssets: number;
  createdAt: string;
}

export type AuditStatus = 'scheduled' | 'in_progress' | 'completed' | 'closed';

export interface AuditResult {
  id: string;
  auditCycle: AuditCycle;
  asset: Asset;
  verifiedBy: Employee;
  status: AuditResultStatus;
  notes?: string;
  verifiedAt: string;
}

export type AuditResultStatus = 'verified' | 'missing' | 'damaged';

// Notification Types
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  entityType?: string;
  entityId?: string;
  createdAt: string;
}

export type NotificationType = 
  | 'asset_assigned'
  | 'booking_approved'
  | 'booking_cancelled'
  | 'booking_reminder'
  | 'maintenance_approved'
  | 'maintenance_rejected'
  | 'transfer_approved'
  | 'transfer_rejected'
  | 'audit_reminder'
  | 'audit_completed'
  | 'overdue_return'
  | 'warranty_expiry'
  | 'asset_retired';

// Activity Log Types
export interface ActivityLog {
  id: string;
  user: User;
  action: string;
  entity: string;
  entityId: string;
  previousValue?: string;
  newValue?: string;
  browser?: string;
  ip?: string;
  timestamp: string;
}

// Report Types
export interface Report {
  id: string;
  title: string;
  type: ReportType;
  format: 'pdf' | 'excel' | 'csv';
  generatedBy: User;
  parameters?: Record<string, unknown>;
  url?: string;
  createdAt: string;
}

export type ReportType = 
  | 'asset_utilization'
  | 'department_utilization'
  | 'maintenance_cost'
  | 'most_used_assets'
  | 'idle_assets'
  | 'lost_assets'
  | 'asset_age'
  | 'booking_heatmap'
  | 'monthly_trends'
  | 'audit_performance';

// Dashboard Types
export interface DashboardStats {
  totalAssets: number;
  availableAssets: number;
  allocatedAssets: number;
  reservedAssets: number;
  underMaintenance: number;
  pendingTransfers: number;
  overdueReturns: number;
  bookingsToday: number;
  auditsInProgress: number;
  expiringWarranty: number;
  lostAssets: number;
  totalDepartments: number;
  totalEmployees: number;
  maintenanceToday: number;
}

export interface KPITrend {
  value: number;
  percentage: number;
  isPositive: boolean;
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system';

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}