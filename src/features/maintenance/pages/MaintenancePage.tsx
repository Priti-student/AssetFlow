import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Package,
  ArrowRight,
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
import { MAINTENANCE_STATUS_COLORS, PRIORITY_COLORS } from '@/constants';
import { maintenanceService } from '@/services/maintenanceService';

const fallbackRequests = [
  { id: '1', asset: 'Canon iR-ADV C3530', title: 'Paper jam issue', priority: 'high', status: 'in_progress', technician: 'Michael Brown', date: '2024-03-19' },
  { id: '2', asset: 'Projector XPS-200', title: 'Lamp replacement needed', priority: 'medium', status: 'pending_approval', technician: '-', date: '2024-03-18' },
  { id: '3', asset: 'MacBook Pro M3', title: 'Battery swelling', priority: 'critical', status: 'approved', technician: 'Michael Brown', date: '2024-03-17' },
  { id: '4', asset: 'Dell Monitor', title: 'Screen flickering', priority: 'low', status: 'resolved', technician: 'James Wilson', date: '2024-03-15' },
  { id: '5', asset: 'Server Rack', title: 'Cooling fan noise', priority: 'medium', status: 'closed', technician: 'Michael Brown', date: '2024-03-10' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function MaintenancePage() {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [requests, setRequests] = useState(fallbackRequests);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [newRequest, setNewRequest] = useState({ asset: '', title: '', priority: 'medium', description: '' });

  const newRequestModal = useModal();
  const viewDetailsModal = useModal();
  const filterModal = useModal();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await maintenanceService.list();
      if (res.success && res.data) {
        const apiRequests = (res.data as any[]).map((r: any) => ({
          id: r.id,
          asset: r.asset?.name || r.asset || 'N/A',
          title: r.title,
          priority: r.priority,
          status: r.status,
          technician: r.assignedTo ? `${r.assignedTo.firstName ?? ''} ${r.assignedTo.lastName ?? ''}`.trim() : r.technician || '-',
          date: r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : r.date || 'N/A',
        }));
        setRequests(apiRequests);
      }
    } catch (error) {
      console.error('Failed to fetch maintenance requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewRequest = () => {
    setNewRequest({ asset: '', title: '', priority: 'medium', description: '' });
    newRequestModal.open();
  };

  const handleNewRequestSubmit = () => {
    const newId = String(requests.length + 1);
    const newItem = {
      id: newId,
      asset: newRequest.asset || 'New Asset',
      title: newRequest.title || 'New Issue',
      priority: newRequest.priority,
      status: 'pending_approval',
      technician: '-',
      date: new Date().toISOString().split('T')[0],
    };
    setRequests(prev => [newItem, ...prev]);
    newRequestModal.close();
  };

  const handleViewDetails = (requestId: string) => {
    const req = requests.find(r => r.id === requestId);
    if (req) {
      setSelectedRequest(req);
      viewDetailsModal.open();
    }
  };

  const filteredRequests = requests.filter(r => activeTab === 'active' ? !['resolved', 'closed'].includes(r.status) : true);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance</h1>
          <p className="text-muted-foreground mt-1">Track and manage asset maintenance requests</p>
        </div>
        <Button onClick={handleNewRequest}>
          <Plus className="h-4 w-4 mr-2" />New Request
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Open Requests', value: requests.filter(r => !['resolved', 'closed'].includes(r.status)).length.toString(), icon: Wrench, color: 'from-primary to-accent' },
          { label: 'In Progress', value: requests.filter(r => r.status === 'in_progress').length.toString(), icon: Clock, color: 'from-accent to-blue-500' },
          { label: 'Critical', value: requests.filter(r => r.priority === 'critical').length.toString(), icon: AlertTriangle, color: 'from-red-500 to-rose-500' },
          { label: 'Resolved This Month', value: requests.filter(r => r.status === 'resolved').length.toString(), icon: CheckCircle2, color: 'from-success to-emerald-500' },
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

      <div className="flex items-center gap-2 border-b border-border/50">
        {['active', 'history'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'active' ? 'Active Requests' : 'History'}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search maintenance requests..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-10 rounded-xl border border-input/50 bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
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
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Asset</th>
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Issue</th>
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Priority</th>
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Technician</th>
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="border-b border-border/50 hover:bg-accent/5 transition-colors group">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{req.asset}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{req.title}</td>
                      <td className="py-3 px-4">
                        <Badge variant="default" size="sm" className={PRIORITY_COLORS[req.priority]}>
                          {req.priority}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="default" size="sm" className={MAINTENANCE_STATUS_COLORS[req.status]}>
                          {req.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">{req.technician}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{req.date}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon-sm" onClick={() => handleViewDetails(req.id)}>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                          <DropdownMenu
                            trigger={<Button variant="ghost" size="icon-sm"><MoreHorizontal className="h-3.5 w-3.5" /></Button>}
                            items={[
                              { label: 'View Details', icon: <Eye className="h-3.5 w-3.5" />, onClick: () => handleViewDetails(req.id) },
                              { label: 'Edit Request', icon: <Edit3 className="h-3.5 w-3.5" />, onClick: () => alert('Edit request form would open here') },
                              { label: 'Delete Request', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: () => alert('Delete confirmation would appear here'), variant: 'destructive' },
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

      {/* New Request Modal */}
      <Modal
        isOpen={newRequestModal.isOpen}
        onClose={newRequestModal.close}
        title="New Maintenance Request"
        description="Report an issue with an asset"
        footer={
          <>
            <Button variant="outline" onClick={newRequestModal.close}>Cancel</Button>
            <Button onClick={handleNewRequestSubmit} disabled={!newRequest.title}>Submit Request</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Asset</label>
            <input
              type="text"
              placeholder="Enter asset name"
              value={newRequest.asset}
              onChange={(e) => setNewRequest(prev => ({ ...prev, asset: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Issue Title *</label>
            <input
              type="text"
              placeholder="Brief description of the issue"
              value={newRequest.title}
              onChange={(e) => setNewRequest(prev => ({ ...prev, title: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              value={newRequest.priority}
              onChange={(e) => setNewRequest(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              placeholder="Detailed description of the issue"
              value={newRequest.description}
              onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
              className="w-full h-24 rounded-xl border border-input/50 bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
        </div>
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={viewDetailsModal.isOpen}
        onClose={viewDetailsModal.close}
        title="Maintenance Request Details"
        description={selectedRequest?.title || ''}
        size="lg"
        footer={
          <Button variant="outline" onClick={viewDetailsModal.close}>Close</Button>
        }
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Asset</p>
                <p className="text-sm font-medium mt-1">{selectedRequest.asset}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Priority</p>
                <Badge variant="default" size="sm" className={`mt-1 ${PRIORITY_COLORS[selectedRequest.priority]}`}>
                  {selectedRequest.priority}
                </Badge>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge variant="default" size="sm" className={`mt-1 ${MAINTENANCE_STATUS_COLORS[selectedRequest.status]}`}>
                  {selectedRequest.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Technician</p>
                <p className="text-sm font-medium mt-1">{selectedRequest.technician}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm font-medium mt-1">{selectedRequest.date}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Filter Modal */}
      <Modal
        isOpen={filterModal.isOpen}
        onClose={filterModal.close}
        title="Filter Requests"
        description="Narrow down maintenance requests"
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
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">All Statuses</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
