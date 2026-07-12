import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  CheckCheck,
  Archive,
  Trash2,
  MoreHorizontal,
  Settings,
  AlertTriangle,
  CheckCircle2,
  CalendarCheck,
  Wrench,
  ArrowRightLeft,
  ClipboardCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const notifications = [
  { id: '1', type: 'asset_assigned', title: 'Asset Assigned', message: 'MacBook Pro M3 has been assigned to Sarah Chen', time: '2 min ago', isRead: false },
  { id: '2', type: 'booking_approved', title: 'Booking Approved', message: 'Conference Room A booking has been approved', time: '15 min ago', isRead: false },
  { id: '3', type: 'maintenance_approved', title: 'Maintenance Approved', message: 'Printer repair request has been approved', time: '1 hour ago', isRead: false },
  { id: '4', type: 'overdue_return', title: 'Overdue Return', message: 'Dell Monitor allocated to Emily Davis is overdue', time: '2 hours ago', isRead: true },
  { id: '5', type: 'audit_completed', title: 'Audit Completed', message: 'Q1 2024 Audit has been completed successfully', time: '4 hours ago', isRead: true },
  { id: '6', type: 'warranty_expiry', title: 'Warranty Expiry', message: 'Server Rack warranty expires in 30 days', time: '1 day ago', isRead: true },
];

const typeIcons: Record<string, React.ElementType> = {
  asset_assigned: ArrowRightLeft,
  booking_approved: CalendarCheck,
  booking_cancelled: CalendarCheck,
  maintenance_approved: Wrench,
  maintenance_rejected: Wrench,
  transfer_approved: ArrowRightLeft,
  transfer_rejected: ArrowRightLeft,
  audit_completed: ClipboardCheck,
  overdue_return: AlertTriangle,
  warranty_expiry: AlertTriangle,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = filter === 'unread' ? notifications.filter(n => !n.isRead) : notifications;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay updated with the latest activities</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<CheckCheck className="h-4 w-4" />}>Mark All Read</Button>
          <Button variant="outline" size="sm" leftIcon={<Settings className="h-4 w-4" />}>Settings</Button>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-border/50">
        {['all', 'unread'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab as typeof filter)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              filter === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'all' ? 'All Notifications' : 'Unread'}
            {tab === 'unread' && (
              <Badge variant="default" size="sm" className="ml-2">{notifications.filter(n => !n.isRead).length}</Badge>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((notification) => {
          const Icon = typeIcons[notification.type] || Bell;
          return (
            <motion.div key={notification.id} variants={itemVariants}>
              <Card className={`group cursor-pointer hover:shadow-md transition-all duration-200 ${!notification.isRead ? 'border-primary/20 bg-primary/[0.02]' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${!notification.isRead ? 'bg-primary/10' : 'bg-muted'}`}>
                      <Icon className={`h-4 w-4 ${!notification.isRead ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{notification.title}</p>
                        {!notification.isRead && <div className="h-2 w-2 rounded-full bg-primary" />}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon-sm"><CheckCheck className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon-sm"><Archive className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon-sm"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}