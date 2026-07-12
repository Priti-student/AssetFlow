import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  Users,
  CalendarCheck,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowRight,
  Wrench,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Loader2,
  Eye,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { dashboardService } from '@/services/dashboardService';
import type { DashboardStats, ActivityLog } from '@/types';

// Mock Data as fallback
const defaultKpiData = [
  { title: 'Total Assets', value: '2,847', trend: 12.5, isPositive: true, icon: Package, color: 'from-primary to-accent' },
  { title: 'Allocated', value: '1,423', trend: 8.2, isPositive: true, icon: Users, color: 'from-secondary to-emerald-500' },
  { title: 'Under Maintenance', value: '24', trend: -3.1, isPositive: false, icon: Wrench, color: 'from-amber-500 to-orange-500' },
  { title: 'Bookings Today', value: '156', trend: 23.5, isPositive: true, icon: CalendarCheck, color: 'from-blue-500 to-indigo-500' },
  { title: 'Overdue Returns', value: '12', trend: -15.2, isPositive: true, icon: AlertTriangle, color: 'from-red-500 to-rose-500' },
  { title: 'Pending Transfers', value: '8', trend: -5.7, isPositive: true, icon: RefreshCw, color: 'from-purple-500 to-pink-500' },
];

const defaultAssetStatusData = [
  { name: 'Available', value: 912, color: '#10b981' },
  { name: 'Allocated', value: 1423, color: '#6366f1' },
  { name: 'Maintenance', value: 24, color: '#f59e0b' },
  { name: 'Retired', value: 48, color: '#6b7280' },
  { name: 'Lost', value: 16, color: '#dc2626' },
  { name: 'Reserved', value: 424, color: '#3b82f6' },
];

const defaultMonthlyTrends = [
  { month: 'Jan', assets: 120, bookings: 45, maintenance: 12 },
  { month: 'Feb', assets: 180, bookings: 52, maintenance: 8 },
  { month: 'Mar', assets: 240, bookings: 68, maintenance: 15 },
  { month: 'Apr', assets: 280, bookings: 75, maintenance: 11 },
  { month: 'May', assets: 320, bookings: 82, maintenance: 9 },
  { month: 'Jun', assets: 380, bookings: 95, maintenance: 14 },
  { month: 'Jul', assets: 420, bookings: 88, maintenance: 18 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  return <span className="text-2xl font-bold">{value}{suffix}</span>;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [kpiData, setKpiData] = useState(defaultKpiData);
  const [assetStatusData, setAssetStatusData] = useState(defaultAssetStatusData);
  const [monthlyTrends, setMonthlyTrends] = useState(defaultMonthlyTrends);
  const [recentActivities, setRecentActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const [statsRes, trendsRes, activitiesRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getTrends('monthly'),
        dashboardService.getActivities(5),
      ]);
      
      if (statsRes.success && statsRes.data) {
        const stats = statsRes.data as DashboardStats;
        setKpiData([
          { title: 'Total Assets', value: (stats.totalAssets ?? 2847).toLocaleString(), trend: 12.5, isPositive: true, icon: Package, color: 'from-primary to-accent' },
          { title: 'Allocated', value: (stats.allocatedAssets ?? 1423).toLocaleString(), trend: 8.2, isPositive: true, icon: Users, color: 'from-secondary to-emerald-500' },
          { title: 'Under Maintenance', value: (stats.underMaintenance ?? 24).toString(), trend: -3.1, isPositive: false, icon: Wrench, color: 'from-amber-500 to-orange-500' },
          { title: 'Bookings Today', value: (stats.bookingsToday ?? 156).toString(), trend: 23.5, isPositive: true, icon: CalendarCheck, color: 'from-blue-500 to-indigo-500' },
          { title: 'Overdue Returns', value: (stats.overdueReturns ?? 12).toString(), trend: -15.2, isPositive: true, icon: AlertTriangle, color: 'from-red-500 to-rose-500' },
          { title: 'Pending Transfers', value: (stats.pendingTransfers ?? 8).toString(), trend: -5.7, isPositive: true, icon: RefreshCw, color: 'from-purple-500 to-pink-500' },
        ]);
      }

      if (trendsRes.success && trendsRes.data) {
        setMonthlyTrends(trendsRes.data as any[]);
      }

      if (activitiesRes.success && activitiesRes.data) {
        setRecentActivities(activitiesRes.data as ActivityLog[]);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Keep using default mock data
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/dashboard/export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      // Fallback: trigger a simple download
      const dataStr = JSON.stringify({ kpiData, assetStatusData, monthlyTrends });
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  const activityItems = recentActivities.length > 0
    ? recentActivities.map((a) => ({
        action: a.action,
        user: `${a.user?.firstName ?? ''} ${a.user?.lastName ?? ''}`.trim() || 'System',
        asset: a.entity,
        time: new Date(a.timestamp).toLocaleString(),
        status: 'success' as const,
      }))
    : [
        { action: 'Asset Allocated', user: 'Sarah Chen', asset: 'MacBook Pro M3', time: '2 min ago', status: 'success' as const },
        { action: 'Booking Approved', user: 'James Wilson', asset: 'Conference Room A', time: '15 min ago', status: 'success' as const },
        { action: 'Maintenance Request', user: 'Emily Davis', asset: 'Projector XPS-200', time: '1 hour ago', status: 'warning' as const },
        { action: 'Transfer Initiated', user: 'Michael Brown', asset: 'Dell OptiPlex', time: '2 hours ago', status: 'info' as const },
        { action: 'Audit Completed', user: 'Lisa Anderson', asset: 'Printers (Dept. 3)', time: '4 hours ago', status: 'success' as const },
      ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's an overview of your organization.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExport} isLoading={isExporting}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={handleRefresh} isLoading={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiData.map((kpi) => (
          <motion.div key={kpi.title} variants={itemVariants}>
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${kpi.color} shadow-sm`}>
                    <kpi.icon className="h-4 w-4 text-white" />
                  </div>
                  <Badge variant={kpi.isPositive ? 'success' : 'warning'} size="sm" className="flex items-center gap-1">
                    {kpi.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(kpi.trend)}%
                  </Badge>
                </div>
                <AnimatedCounter value={kpi.value} />
                <p className="text-xs text-muted-foreground mt-1">{kpi.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Asset Utilization</CardTitle>
                <CardDescription>Monthly overview of assets, bookings & maintenance</CardDescription>
              </div>
              <Button variant="ghost" size="icon-sm" onClick={() => navigate('/reports')}>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrends}>
                    <defs>
                      <linearGradient id="colorAssets" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="assets" stroke="#6366f1" fillOpacity={1} fill="url(#colorAssets)" strokeWidth={2} />
                    <Area type="monotone" dataKey="bookings" stroke="#10b981" fillOpacity={1} fill="url(#colorBookings)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Asset Status</CardTitle>
                <CardDescription>Current distribution across all assets</CardDescription>
              </div>
              <Button variant="ghost" size="icon-sm" onClick={() => navigate('/reports')}>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie data={assetStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                      {assetStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
                  </RePieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                  {assetStatusData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-xs text-muted-foreground">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions across your organization</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/notifications')}>
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {activityItems.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent/5 transition-colors cursor-pointer">
                    <div className={`h-2 w-2 rounded-full ${
                      activity.status === 'success' ? 'bg-success' :
                      activity.status === 'warning' ? 'bg-warning' : 'bg-accent'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.user} • {activity.asset}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Actions requiring your attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Transfer Requests', count: 8, color: 'text-accent', href: '/transfers' },
                { label: 'Maintenance Requests', count: 5, color: 'text-warning', href: '/maintenance' },
                { label: 'Booking Approvals', count: 12, color: 'text-primary', href: '/bookings' },
                { label: 'Audit Verifications', count: 3, color: 'text-secondary', href: '/audit' },
              ].map((item) => (
                <div
                  key={item.label}
                  onClick={() => navigate(item.href)}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted/80 transition-colors cursor-pointer"
                >
                  <span className="text-sm font-medium">{item.label}</span>
                  <Badge variant="default" className={item.color}>{item.count}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}