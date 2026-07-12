import { useState, useEffect } from 'react';
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
  Loader2,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal, useModal } from '@/components/ui/Modal';
import { notificationService } from '@/services/notificationService';

const fallbackNotifications = [
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
  const [notifications, setNotifications] = useState(fallbackNotifications);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.list();
      if (res.success && res.data) {
        const apiNotifs = (res.data as any[]).map((n: any) => ({
          id: n.id,
          type: n.type,
          title: n.title,
          message: n.message,
          time: n.createdAt ? new Date(n.createdAt).toLocaleString() : n.time || 'N/A',
          isRead: n.isRead,
        }));
        setNotifications(apiNotifs);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      // Optimistic update
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }
  };

  const handleMarkRead = async (notificationId: string) => {
    try {
      await notificationService.markRead(notificationId);
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Optimistic update
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
    }
  };

  const handleArchive = async (notificationId: string) => {
    try {
      await notificationService.archive(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Failed to archive notification:', error);
      // Optimistic update
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    }
  };

  const handleDelete = async (notificationId: string) => {
    if (confirm('Delete this notification?')) {
      try {
        await notificationService.delete(notificationId);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
      } catch (error) {
        console.error('Failed to delete notification:', error);
        // Optimistic update
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
      }
    }
  };

  const settingsModal = useModal();

  const handleSettings = () => {
    settingsModal.open();
  };

  const filtered = filter === 'unread' ? notifications.filter(n => !n.isRead) : notifications;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay updated with the latest activities</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="h-4 w-4 mr-2" />Mark All Read
          </Button>
          <Button variant="outline" size="sm" onClick={handleSettings}>
            <Settings className="h-4 w-4 mr-2" />Settings
          </Button>
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

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
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
                        {!notification.isRead && (
                          <Button variant="ghost" size="icon-sm" onClick={() => handleMarkRead(notification.id)}>
                            <CheckCheck className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon-sm" onClick={() => handleArchive(notification.id)}>
                          <Archive className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(notification.id)}>
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No notifications to show</p>
            </div>
          )}
        </div>
      )}

      {/* Settings Modal */}
      <Modal
        isOpen={settingsModal.isOpen}
        onClose={settingsModal.close}
        title="Notification Settings"
        description="Configure your notification preferences"
        size="lg"
        footer={
          <Button onClick={settingsModal.close}>Save Preferences</Button>
        }
      >
        <div className="space-y-4">
          {[
            { label: 'Asset Assignments', desc: 'When assets are assigned to you' },
            { label: 'Booking Updates', desc: 'When bookings are approved or rejected' },
            { label: 'Maintenance Requests', desc: 'When maintenance requests are updated' },
            { label: 'Transfer Approvals', desc: 'When transfers require your approval' },
            { label: 'Audit Reminders', desc: 'When audit cycles are starting or due' },
            { label: 'Warranty Expiry', desc: 'When asset warranties are about to expire' },
            { label: 'Overdue Returns', desc: 'When allocated assets are overdue' },
            { label: 'System Updates', desc: 'When system updates or maintenance occurs' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
              </label>
            </div>
          ))}
        </div>
      </Modal>
    </motion.div>
  );
}
