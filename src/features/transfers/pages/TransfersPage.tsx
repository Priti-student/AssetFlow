import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  GitCompareArrows,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  User,
  Package,
  Building2,
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
import { transferService } from '@/services/transferService';

const fallbackTransfers = [
  { id: '1', asset: 'MacBook Pro M3', from: 'Sarah Chen', fromDept: 'IT', to: 'David Lee', toDept: 'R&D', date: '2024-03-15', status: 'pending' },
  { id: '2', asset: 'Dell Monitor', from: 'Emily Davis', fromDept: 'Marketing', to: 'James Wilson', toDept: 'Engineering', date: '2024-03-14', status: 'approved' },
  { id: '3', asset: 'iPad Pro', from: 'Michael Brown', fromDept: 'IT', to: 'Lisa Anderson', toDept: 'Finance', date: '2024-03-13', status: 'completed' },
  { id: '4', asset: 'ThinkPad X1', from: 'Robert Brown', fromDept: 'Management', to: 'Sarah Chen', toDept: 'IT', date: '2024-03-12', status: 'rejected' },
  { id: '5', asset: 'iPhone 15 Pro', from: 'James Wilson', fromDept: 'Engineering', to: 'Anna Martinez', toDept: 'HR', date: '2024-03-11', status: 'pending' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function TransfersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [transfers, setTransfers] = useState(fallbackTransfers);
  const [loading, setLoading] = useState(true);
  const [selectedTransfer, setSelectedTransfer] = useState<any>(null);
  const [newTransfer, setNewTransfer] = useState({ asset: '', from: '', to: '', reason: '' });

  const newTransferModal = useModal();
  const viewDetailsModal = useModal();
  const filterModal = useModal();

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    setLoading(true);
    try {
      const res = await transferService.list();
      if (res.success && res.data) {
        const apiTransfers = (res.data as any[]).map((t: any) => ({
          id: t.id,
          asset: t.asset?.name || t.asset || 'N/A',
          from: t.fromEmployee ? `${t.fromEmployee.firstName ?? ''} ${t.fromEmployee.lastName ?? ''}`.trim() : t.from || 'N/A',
          fromDept: t.fromDepartment?.name || t.fromDept || 'N/A',
          to: t.toEmployee ? `${t.toEmployee.firstName ?? ''} ${t.toEmployee.lastName ?? ''}`.trim() : t.to || 'N/A',
          toDept: t.toDepartment?.name || t.toDept || 'N/A',
          date: t.createdAt ? new Date(t.createdAt).toISOString().split('T')[0] : t.date || 'N/A',
          status: t.status,
        }));
        setTransfers(apiTransfers);
      }
    } catch (error) {
      console.error('Failed to fetch transfers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewTransfer = () => {
    setNewTransfer({ asset: '', from: '', to: '', reason: '' });
    newTransferModal.open();
  };

  const handleNewTransferSubmit = () => {
    const newId = String(transfers.length + 1);
    const newItem = {
      id: newId,
      asset: newTransfer.asset || 'New Asset',
      from: newTransfer.from || 'Current User',
      fromDept: 'N/A',
      to: newTransfer.to || 'Unassigned',
      toDept: 'N/A',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    setTransfers(prev => [newItem, ...prev]);
    newTransferModal.close();
  };

  const handleViewDetails = (transferId: string) => {
    const transfer = transfers.find(t => t.id === transferId);
    if (transfer) {
      setSelectedTransfer(transfer);
      viewDetailsModal.open();
    }
  };

  const handleApprove = async (transferId: string) => {
    if (confirm('Approve this transfer request?')) {
      try {
        await transferService.approve(transferId);
        setTransfers(prev => prev.map(t => t.id === transferId ? { ...t, status: 'approved' } : t));
      } catch (error) {
        console.error('Failed to approve transfer:', error);
        alert('Failed to approve transfer. Please try again.');
      }
    }
  };

  const handleReject = async (transferId: string) => {
    if (confirm('Reject this transfer request?')) {
      try {
        await transferService.reject(transferId);
        setTransfers(prev => prev.map(t => t.id === transferId ? { ...t, status: 'rejected' } : t));
      } catch (error) {
        console.error('Failed to reject transfer:', error);
        alert('Failed to reject transfer. Please try again.');
      }
    }
  };

  const filteredTransfers = searchQuery
    ? transfers.filter(t =>
        t.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.to.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : transfers;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transfers</h1>
          <p className="text-muted-foreground mt-1">Manage asset transfers between employees and departments</p>
        </div>
        <Button onClick={handleNewTransfer}>
          <Plus className="h-4 w-4 mr-2" />New Transfer
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending Transfers', value: transfers.filter(t => t.status === 'pending').length.toString(), icon: GitCompareArrows, color: 'from-primary to-accent' },
          { label: 'Approved', value: transfers.filter(t => t.status === 'approved').length.toString(), icon: CheckCircle2, color: 'from-success to-emerald-500' },
          { label: 'Completed', value: transfers.filter(t => t.status === 'completed').length.toString(), icon: GitCompareArrows, color: 'from-accent to-blue-500' },
          { label: 'Rejected', value: transfers.filter(t => t.status === 'rejected').length.toString(), icon: XCircle, color: 'from-red-500 to-rose-500' },
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
          <input type="text" placeholder="Search transfers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-10 rounded-xl border border-input/50 bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
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
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">From</th>
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">To</th>
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransfers.map((transfer) => (
                    <tr key={transfer.id} className="border-b border-border/50 hover:bg-accent/5 transition-colors group">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{transfer.asset}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          {transfer.from}
                          <span className="text-xs text-muted-foreground">({transfer.fromDept})</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          {transfer.to}
                          <span className="text-xs text-muted-foreground">({transfer.toDept})</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{transfer.date}</td>
                      <td className="py-3 px-4">
                        <Badge variant={transfer.status === 'completed' ? 'success' : transfer.status === 'rejected' ? 'destructive' : transfer.status === 'approved' ? 'default' : 'warning'} size="sm">
                          {transfer.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {transfer.status === 'pending' && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon-sm" onClick={() => handleApprove(transfer.id)}>
                              <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                            </Button>
                            <Button variant="ghost" size="icon-sm" onClick={() => handleReject(transfer.id)}>
                              <XCircle className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                            <DropdownMenu
                              trigger={<Button variant="ghost" size="icon-sm"><MoreHorizontal className="h-3.5 w-3.5" /></Button>}
                              items={[
                                { label: 'View Details', icon: <Eye className="h-3.5 w-3.5" />, onClick: () => handleViewDetails(transfer.id) },
                                { label: 'Edit Transfer', icon: <Edit3 className="h-3.5 w-3.5" />, onClick: () => alert('Edit transfer form would open here') },
                                { label: 'Delete Transfer', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: () => alert('Delete confirmation would appear here'), variant: 'destructive' },
                              ]}
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* New Transfer Modal */}
      <Modal
        isOpen={newTransferModal.isOpen}
        onClose={newTransferModal.close}
        title="New Transfer"
        description="Transfer an asset between employees or departments"
        footer={
          <>
            <Button variant="outline" onClick={newTransferModal.close}>Cancel</Button>
            <Button onClick={handleNewTransferSubmit} disabled={!newTransfer.asset}>Create Transfer</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Asset *</label>
            <input
              type="text"
              placeholder="Enter asset name"
              value={newTransfer.asset}
              onChange={(e) => setNewTransfer(prev => ({ ...prev, asset: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">From Employee</label>
            <input
              type="text"
              placeholder="Current holder's name"
              value={newTransfer.from}
              onChange={(e) => setNewTransfer(prev => ({ ...prev, from: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">To Employee</label>
            <input
              type="text"
              placeholder="New holder's name"
              value={newTransfer.to}
              onChange={(e) => setNewTransfer(prev => ({ ...prev, to: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Reason</label>
            <textarea
              placeholder="Enter reason for transfer"
              value={newTransfer.reason}
              onChange={(e) => setNewTransfer(prev => ({ ...prev, reason: e.target.value }))}
              className="w-full h-20 rounded-xl border border-input/50 bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
        </div>
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={viewDetailsModal.isOpen}
        onClose={viewDetailsModal.close}
        title="Transfer Details"
        description={selectedTransfer?.asset || ''}
        size="lg"
        footer={
          <Button variant="outline" onClick={viewDetailsModal.close}>Close</Button>
        }
      >
        {selectedTransfer && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Asset</p>
                <p className="text-sm font-medium mt-1">{selectedTransfer.asset}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge variant={selectedTransfer.status === 'completed' ? 'success' : selectedTransfer.status === 'rejected' ? 'destructive' : selectedTransfer.status === 'approved' ? 'default' : 'warning'} size="sm" className="mt-1">
                  {selectedTransfer.status}
                </Badge>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">From</p>
                <p className="text-sm font-medium mt-1">{selectedTransfer.from} ({selectedTransfer.fromDept})</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">To</p>
                <p className="text-sm font-medium mt-1">{selectedTransfer.to} ({selectedTransfer.toDept})</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm font-medium mt-1">{selectedTransfer.date}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Filter Modal */}
      <Modal
        isOpen={filterModal.isOpen}
        onClose={filterModal.close}
        title="Filter Transfers"
        description="Narrow down transfers by criteria"
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
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
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
