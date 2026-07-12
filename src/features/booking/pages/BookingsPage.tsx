import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarCheck,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  User,
  Package,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const bookings = [
  { id: '1', asset: 'Conference Room A', user: 'Sarah Chen', date: '2024-03-20', time: '10:00 - 12:00', purpose: 'Team Meeting', status: 'approved' },
  { id: '2', asset: 'Projector XPS-200', user: 'James Wilson', date: '2024-03-21', time: '14:00 - 16:00', purpose: 'Client Presentation', status: 'pending' },
  { id: '3', asset: 'Conference Room B', user: 'Emily Davis', date: '2024-03-20', time: '13:00 - 15:00', purpose: 'Training Session', status: 'ongoing' },
  { id: '4', asset: 'MacBook Pro M3', user: 'Michael Brown', date: '2024-03-22', time: '09:00 - 17:00', purpose: 'Development Work', status: 'upcoming' },
  { id: '5', asset: 'Meeting Pod 3', user: 'Lisa Anderson', date: '2024-03-19', time: '11:00 - 12:00', purpose: '1:1 Meeting', status: 'completed' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function BookingsPage() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground mt-1">Book and manage shared resources</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border/50 p-0.5">
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:text-foreground'}`}>
              <CalendarCheck className="h-4 w-4" />
            </button>
            <button onClick={() => setViewMode('calendar')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'calendar' ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:text-foreground'}`}>
              <Calendar className="h-4 w-4" />
            </button>
          </div>
          <Button leftIcon={<Plus className="h-4 w-4" />}>New Booking</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Bookings Today', value: '24', icon: CalendarCheck, color: 'from-primary to-accent' },
          { label: 'Pending Approval', value: '8', icon: Clock, color: 'from-amber-500 to-orange-500' },
          { label: 'Upcoming', value: '45', icon: Calendar, color: 'from-accent to-blue-500' },
          { label: 'Completed', value: '156', icon: CheckCircle2, color: 'from-success to-emerald-500' },
        ].map((stat) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search bookings..." className="w-full h-10 rounded-xl border border-input/50 bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>Filter</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 text-left">
                  <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Resource</th>
                  <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Booked By</th>
                  <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
                  <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Purpose</th>
                  <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-border/50 hover:bg-accent/5 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{booking.asset}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        {booking.user}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{booking.date}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{booking.time}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{booking.purpose}</td>
                    <td className="py-3 px-4">
                      <Badge variant={booking.status === 'approved' ? 'success' : booking.status === 'pending' ? 'warning' : booking.status === 'ongoing' ? 'default' : booking.status === 'completed' ? 'secondary' : 'default'} size="sm">
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {booking.status === 'pending' && (
                          <>
                            <Button variant="ghost" size="icon-sm"><CheckCircle2 className="h-3.5 w-3.5 text-success" /></Button>
                            <Button variant="ghost" size="icon-sm"><XCircle className="h-3.5 w-3.5 text-destructive" /></Button>
                          </>
                        )}
                        <Button variant="ghost" size="icon-sm"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}