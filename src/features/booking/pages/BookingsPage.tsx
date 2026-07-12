import { useState, useEffect } from 'react';
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
  Loader2,
  Eye,
  Edit3,
  Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal, useModal } from '@/components/ui/Modal';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { bookingService } from '@/services/bookingService';

const fallbackBookings = [
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
  const [bookings, setBookings] = useState(fallbackBookings);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [newBooking, setNewBooking] = useState({ asset: '', purpose: '', date: '', startTime: '', endTime: '' });

  const newBookingModal = useModal();
  const viewDetailsModal = useModal();
  const filterModal = useModal();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingService.list();
      if (res.success && res.data) {
        const apiBookings = (res.data as any[]).map((b: any) => ({
          id: b.id,
          asset: b.asset?.name || b.asset || 'N/A',
          user: b.bookedBy ? `${b.bookedBy.firstName ?? ''} ${b.bookedBy.lastName ?? ''}`.trim() : b.user || 'N/A',
          date: b.startDate ? new Date(b.startDate).toISOString().split('T')[0] : b.date || 'N/A',
          time: b.startDate && b.endDate
            ? `${new Date(b.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(b.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            : b.time || 'N/A',
          purpose: b.purpose || 'N/A',
          status: b.status,
        }));
        setBookings(apiBookings);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewBooking = () => {
    setNewBooking({ asset: '', purpose: '', date: '', startTime: '', endTime: '' });
    newBookingModal.open();
  };

  const handleNewBookingSubmit = () => {
    const newId = String(bookings.length + 1);
    const newItem = {
      id: newId,
      asset: newBooking.asset || 'New Resource',
      user: 'Current User',
      date: newBooking.date || new Date().toISOString().split('T')[0],
      time: `${newBooking.startTime || '09:00'} - ${newBooking.endTime || '10:00'}`,
      purpose: newBooking.purpose || 'N/A',
      status: 'pending',
    };
    setBookings(prev => [newItem, ...prev]);
    newBookingModal.close();
  };

  const handleViewDetails = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setSelectedBooking(booking);
      viewDetailsModal.open();
    }
  };

  const handleApprove = async (bookingId: string) => {
    if (confirm('Approve this booking?')) {
      try {
        await bookingService.approve(bookingId);
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'approved' } : b));
      } catch (error) {
        console.error('Failed to approve booking:', error);
        alert('Failed to approve booking. Please try again.');
      }
    }
  };

  const handleReject = async (bookingId: string) => {
    if (confirm('Reject this booking?')) {
      try {
        await bookingService.reject(bookingId);
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'rejected' } : b));
      } catch (error) {
        console.error('Failed to reject booking:', error);
        alert('Failed to reject booking. Please try again.');
      }
    }
  };

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
          <Button onClick={handleNewBooking}>
            <Plus className="h-4 w-4 mr-2" />New Booking
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Bookings Today', value: bookings.filter(b => b.status === 'ongoing' || b.status === 'approved').length.toString(), icon: CalendarCheck, color: 'from-primary to-accent' },
          { label: 'Pending Approval', value: bookings.filter(b => b.status === 'pending').length.toString(), icon: Clock, color: 'from-amber-500 to-orange-500' },
          { label: 'Upcoming', value: bookings.filter(b => b.status === 'upcoming').length.toString(), icon: Calendar, color: 'from-accent to-blue-500' },
          { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length.toString(), icon: CheckCircle2, color: 'from-success to-emerald-500' },
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
          <input type="text" placeholder="Search bookings..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-10 rounded-xl border border-input/50 bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <Button variant="outline" onClick={() => filterModal.open()}>
          <Filter className="h-4 w-4 mr-2" />Filter
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
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
                              <Button variant="ghost" size="icon-sm" onClick={() => handleApprove(booking.id)}>
                                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                              </Button>
                              <Button variant="ghost" size="icon-sm" onClick={() => handleReject(booking.id)}>
                                <XCircle className="h-3.5 w-3.5 text-destructive" />
                              </Button>
                            </>
                          )}
                          <DropdownMenu
                            trigger={<Button variant="ghost" size="icon-sm"><MoreHorizontal className="h-3.5 w-3.5" /></Button>}
                            items={[
                              { label: 'View Details', icon: <Eye className="h-3.5 w-3.5" />, onClick: () => handleViewDetails(booking.id) },
                              { label: 'Edit Booking', icon: <Edit3 className="h-3.5 w-3.5" />, onClick: () => alert('Edit booking form would open here') },
                              { label: 'Cancel Booking', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: () => alert('Cancel booking confirmation would appear here'), variant: 'destructive' },
                            ]}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* New Booking Modal */}
      <Modal
        isOpen={newBookingModal.isOpen}
        onClose={newBookingModal.close}
        title="New Booking"
        description="Book a resource"
        footer={
          <>
            <Button variant="outline" onClick={newBookingModal.close}>Cancel</Button>
            <Button onClick={handleNewBookingSubmit} disabled={!newBooking.asset}>Create Booking</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Resource *</label>
            <input
              type="text"
              placeholder="Enter resource name"
              value={newBooking.asset}
              onChange={(e) => setNewBooking(prev => ({ ...prev, asset: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Purpose</label>
            <input
              type="text"
              placeholder="Enter booking purpose"
              value={newBooking.purpose}
              onChange={(e) => setNewBooking(prev => ({ ...prev, purpose: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={newBooking.date}
              onChange={(e) => setNewBooking(prev => ({ ...prev, date: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Start Time</label>
              <input
                type="time"
                value={newBooking.startTime}
                onChange={(e) => setNewBooking(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <input
                type="time"
                value={newBooking.endTime}
                onChange={(e) => setNewBooking(prev => ({ ...prev, endTime: e.target.value }))}
                className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={viewDetailsModal.isOpen}
        onClose={viewDetailsModal.close}
        title="Booking Details"
        description={selectedBooking?.asset || ''}
        size="lg"
        footer={
          <Button variant="outline" onClick={viewDetailsModal.close}>Close</Button>
        }
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Resource</p>
                <p className="text-sm font-medium mt-1">{selectedBooking.asset}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Booked By</p>
                <p className="text-sm font-medium mt-1">{selectedBooking.user}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm font-medium mt-1">{selectedBooking.date}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="text-sm font-medium mt-1">{selectedBooking.time}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Purpose</p>
                <p className="text-sm font-medium mt-1">{selectedBooking.purpose}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge variant={selectedBooking.status === 'approved' ? 'success' : selectedBooking.status === 'pending' ? 'warning' : selectedBooking.status === 'ongoing' ? 'default' : 'secondary'} size="sm" className="mt-1">
                  {selectedBooking.status}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Filter Modal */}
      <Modal
        isOpen={filterModal.isOpen}
        onClose={filterModal.close}
        title="Filter Bookings"
        description="Narrow down bookings by criteria"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={filterModal.close}>Clear Filters</Button>
            <Button onClick={filterModal.close}>Apply Filters</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date Range</label>
            <div className="grid grid-cols-2 gap-3">
              <input type="date" className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              <input type="date" className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
