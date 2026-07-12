import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRightLeft,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
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
import { allocationService } from '@/services/allocationService';

const fallbackAllocations = [
  { id: '1', asset: 'MacBook Pro M3', employee: 'Sarah Chen', department: 'IT', date: '2024-01-15', expectedReturn: '2024-12-31', status: 'active' },
  { id: '2', asset: 'iPhone 15 Pro', employee: 'James Wilson', department: 'Engineering', date: '2024-02-01', expectedReturn: '2025-01-31', status: 'active' },
  { id: '3', asset: 'Dell Monitor', employee: 'Emily Davis', department: 'Marketing', date: '2024-01-10', expectedReturn: '2024-06-10', status: 'overdue' },
  { id: '4', asset: 'iPad Pro', employee: 'Michael Brown', department: 'IT', date: '2023-06-01', expectedReturn: '2024-06-01', status: 'returned' },
  { id: '5', asset: 'ThinkPad X1', employee: 'Lisa Anderson', department: 'Finance', date: '2024-03-01', expectedReturn: '2025-02-28', status: 'active' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function AllocationPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [allocations, setAllocations] = useState(fallbackAllocations);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAllocation, setSelectedAllocation] = useState<any>(null);
  const [newAllocation, setNewAllocation] = useState({ asset: '', employee: '', department: '', expectedReturn: '' });

  const newAllocationModal = useModal();
  const viewDetailsModal = useModal();
  const filterModal = useModal();

  useEffect(() => {
    fetchAllocations();
  }, []);

  const fetchAllocations = async () => {
    setLoading(true);
    try {
      const res = await allocationService.list();
      if (res.success && res.data) {
        const apiAllocs = (res.data as any[]).map((a: any) => ({
          id: a.id,
          asset: a.asset?.name || a.asset || 'N/A',
          employee: a.employee ? `${a.employee.firstName ?? ''} ${a.employee.lastName ?? ''}`.trim() : a.employeeName || 'N/A',
          department: a.department?.name || a.department || 'N/A',
          date: a.allocatedAt ? new Date(a.allocatedAt).toISOString().split('T')[0] : a.date || 'N/A',
          expectedReturn: a.expectedReturnDate ? new Date(a.expectedReturnDate).toISOString().split('T')[0] : a.expectedReturn || 'N/A',
          status: a.status,
        }));
        setAllocations(apiAllocs);
      }
    } catch (error) {
      console.error('Failed to fetch allocations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewAllocation = () => {
    setNewAllocation({ asset: '', employee: '', department: '', expectedReturn: '' });
    newAllocationModal.open();
  };

  const handleNewAllocationSubmit = () => {
    const newId = String(allocations.length + 1);
    const newItem = {
      id: newId,
      asset: newAllocation.asset || 'New Asset',
      employee: newAllocation.employee || 'Unassigned',
      department: newAllocation.department || 'N/A',
      date: new Date().toISOString().split('T')[0],
      expectedReturn: newAllocation.expectedReturn || 'N/A',
      status: 'active',
    };
    setAllocations(prev => [newItem, ...prev]);
    newAllocationModal.close();
  };

  const handleViewDetails = (allocationId: string) => {
    const alloc = allocations.find(a => a.id === allocationId);
    if (alloc) {
      setSelectedAllocation(alloc);
      viewDetailsModal.open();
    }
  };

  const handleReturn = async (allocationId: string) => {
    if (confirm('Confirm return of this asset?')) {
      try {
        await allocationService.return(allocationId);
        setAllocations(prev => prev.map(a => a.id === allocationId ? { ...a, status: 'returned' } : a));
      } catch (error) {
        console.error('Failed to return allocation:', error);
        alert('Failed to process return. Please try again.');
      }
    }
  };

  const filteredAllocations = allocations.filter(a => activeTab === 'active' ? a.status !== 'returned' : true);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Allocations</h1>
          <p className="text-muted-foreground mt-1">Manage asset allocations and track returns</p>
        </div>
        <Button onClick={handleNewAllocation}>
          <Plus className="h-4 w-4 mr-2" />New Allocation
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Allocations', value: allocations.filter(a => a.status === 'active').length.toString(), icon: ArrowRightLeft, color: 'from-primary to-accent' },
          { label: 'Overdue Returns', value: allocations.filter(a => a.status === 'overdue').length.toString(), icon: Clock, color: 'from-red-500 to-rose-500' },
          { label: 'Returned This Month', value: allocations.filter(a => a.status === 'returned').length.toString(), icon: CheckCircle2, color: 'from-success to-emerald-500' },
          { label: 'Total Allocations', value: allocations.length.toString(), icon: Package, color: 'from-accent to-blue-500' },
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
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Allocations
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search allocations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-10 rounded-xl border border-input/50 bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
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
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Employee</th>
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</th>
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Allocated Date</th>
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Expected Return</th>
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAllocations.map((alloc) => (
                    <tr key={alloc.id} className="border-b border-border/50 hover:bg-accent/5 transition-colors group">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{alloc.asset}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{alloc.employee}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{alloc.department}</td>
                      <td className="py-3 px-4 text-sm">{alloc.date}</td>
                      <td className="py-3 px-4 text-sm">{alloc.expectedReturn}</td>
                      <td className="py-3 px-4">
                        <Badge variant={alloc.status === 'active' ? 'default' : alloc.status === 'overdue' ? 'destructive' : 'success'} size="sm">
                          {alloc.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {alloc.status !== 'returned' && (
                            <Button variant="ghost" size="icon-sm" onClick={() => handleReturn(alloc.id)}>
                              <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                            </Button>
                          )}
                          <DropdownMenu
                            trigger={<Button variant="ghost" size="icon-sm"><MoreHorizontal className="h-3.5 w-3.5" /></Button>}
                            items={[
                              { label: 'View Details', icon: <Eye className="h-3.5 w-3.5" />, onClick: () => handleViewDetails(alloc.id) },
                              { label: 'Edit Allocation', icon: <Edit3 className="h-3.5 w-3.5" />, onClick: () => alert('Edit allocation form would open here') },
                              { label: 'Delete Allocation', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: () => alert('Delete confirmation would appear here'), variant: 'destructive' },
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

      {/* New Allocation Modal */}
      <Modal
        isOpen={newAllocationModal.isOpen}
        onClose={newAllocationModal.close}
        title="New Allocation"
        description="Allocate an asset to an employee"
        footer={
          <>
            <Button variant="outline" onClick={newAllocationModal.close}>Cancel</Button>
            <Button onClick={handleNewAllocationSubmit} disabled={!newAllocation.asset}>Create Allocation</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Asset *</label>
            <input
              type="text"
              placeholder="Enter asset name"
              value={newAllocation.asset}
              onChange={(e) => setNewAllocation(prev => ({ ...prev, asset: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Employee</label>
            <input
              type="text"
              placeholder="Enter employee name"
              value={newAllocation.employee}
              onChange={(e) => setNewAllocation(prev => ({ ...prev, employee: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <input
              type="text"
              placeholder="Enter department"
              value={newAllocation.department}
              onChange={(e) => setNewAllocation(prev => ({ ...prev, department: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Expected Return Date</label>
            <input
              type="date"
              value={newAllocation.expectedReturn}
              onChange={(e) => setNewAllocation(prev => ({ ...prev, expectedReturn: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={viewDetailsModal.isOpen}
        onClose={viewDetailsModal.close}
        title="Allocation Details"
        description={selectedAllocation?.asset || ''}
        size="lg"
        footer={
          <Button variant="outline" onClick={viewDetailsModal.close}>Close</Button>
        }
      >
        {selectedAllocation && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Asset</p>
                <p className="text-sm font-medium mt-1">{selectedAllocation.asset}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Employee</p>
                <p className="text-sm font-medium mt-1">{selectedAllocation.employee}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Department</p>
                <p className="text-sm font-medium mt-1">{selectedAllocation.department}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge variant={selectedAllocation.status === 'active' ? 'default' : selectedAllocation.status === 'overdue' ? 'destructive' : 'success'} size="sm" className="mt-1">
                  {selectedAllocation.status}
                </Badge>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Allocated Date</p>
                <p className="text-sm font-medium mt-1">{selectedAllocation.date}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Expected Return</p>
                <p className="text-sm font-medium mt-1">{selectedAllocation.expectedReturn}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Filter Modal */}
      <Modal
        isOpen={filterModal.isOpen}
        onClose={filterModal.close}
        title="Filter Allocations"
        description="Narrow down allocations by criteria"
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
              <option value="active">Active</option>
              <option value="overdue">Overdue</option>
              <option value="returned">Returned</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <select className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">All Departments</option>
              <option value="IT">IT</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date Range</label>
            <div className="grid grid-cols-2 gap-3">
              <input type="date" placeholder="From" className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              <input type="date" placeholder="To" className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
