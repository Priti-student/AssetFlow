import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardCheck,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Package,
  Shield,
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
import { auditService } from '@/services/auditService';

const fallbackAuditCycles = [
  { id: '1', title: 'Q1 2024 Audit', status: 'in_progress', auditor: 'Lisa Anderson', startDate: '2024-03-01', endDate: '2024-03-30', total: 500, verified: 320, missing: 5, damaged: 3 },
  { id: '2', title: 'Monthly IT Audit', status: 'scheduled', auditor: 'Lisa Anderson', startDate: '2024-04-01', endDate: '2024-04-15', total: 200, verified: 0, missing: 0, damaged: 0 },
  { id: '3', title: 'Finance Year-End', status: 'completed', auditor: 'Robert Brown', startDate: '2024-02-01', endDate: '2024-02-28', total: 350, verified: 348, missing: 2, damaged: 0 },
  { id: '4', title: 'Operations Audit', status: 'closed', auditor: 'Lisa Anderson', startDate: '2024-01-15', endDate: '2024-02-15', total: 280, verified: 275, missing: 3, damaged: 2 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function AuditPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [auditCycles, setAuditCycles] = useState(fallbackAuditCycles);
  const [loading, setLoading] = useState(true);
  const [selectedCycle, setSelectedCycle] = useState<any>(null);
  const [newCycle, setNewCycle] = useState({ title: '', auditor: '', startDate: '', endDate: '' });

  const newCycleModal = useModal();
  const viewDetailsModal = useModal();
  const filterModal = useModal();

  useEffect(() => {
    fetchAuditCycles();
  }, []);

  const fetchAuditCycles = async () => {
    setLoading(true);
    try {
      const res = await auditService.getCycles();
      if (res.success && res.data) {
        const apiCycles = (res.data as any[]).map((c: any) => ({
          id: c.id,
          title: c.title,
          status: c.status,
          auditor: c.assignedAuditor ? `${c.assignedAuditor.firstName ?? ''} ${c.assignedAuditor.lastName ?? ''}`.trim() : c.auditor || 'N/A',
          startDate: c.startDate ? new Date(c.startDate).toISOString().split('T')[0] : c.startDate || 'N/A',
          endDate: c.endDate ? new Date(c.endDate).toISOString().split('T')[0] : c.endDate || 'N/A',
          total: c.totalAssets ?? c.total ?? 0,
          verified: c.verifiedAssets ?? c.verified ?? 0,
          missing: c.missingAssets ?? c.missing ?? 0,
          damaged: c.damagedAssets ?? c.damaged ?? 0,
        }));
        setAuditCycles(apiCycles);
      }
    } catch (error) {
      console.error('Failed to fetch audit cycles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewAuditCycle = () => {
    setNewCycle({ title: '', auditor: '', startDate: '', endDate: '' });
    newCycleModal.open();
  };

  const handleNewCycleSubmit = () => {
    const newId = String(auditCycles.length + 1);
    const newItem = {
      id: newId,
      title: newCycle.title || 'New Audit',
      status: 'scheduled',
      auditor: newCycle.auditor || 'Unassigned',
      startDate: newCycle.startDate || new Date().toISOString().split('T')[0],
      endDate: newCycle.endDate || '',
      total: 0,
      verified: 0,
      missing: 0,
      damaged: 0,
    };
    setAuditCycles(prev => [newItem, ...prev]);
    newCycleModal.close();
  };

  const handleViewDetails = (cycleId: string) => {
    const cycle = auditCycles.find(c => c.id === cycleId);
    if (cycle) {
      setSelectedCycle(cycle);
      viewDetailsModal.open();
    }
  };

  const filteredCycles = searchQuery
    ? auditCycles.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.auditor.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : auditCycles;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit</h1>
          <p className="text-muted-foreground mt-1">Manage audit cycles and verify asset records</p>
        </div>
        <Button onClick={handleNewAuditCycle}>
          <Plus className="h-4 w-4 mr-2" />New Audit Cycle
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Audits', value: auditCycles.filter(c => c.status === 'in_progress').length.toString(), icon: ClipboardCheck, color: 'from-primary to-accent' },
          { label: 'Scheduled', value: auditCycles.filter(c => c.status === 'scheduled').length.toString(), icon: Clock, color: 'from-accent to-blue-500' },
          { label: 'Completed', value: auditCycles.filter(c => c.status === 'completed').length.toString(), icon: CheckCircle2, color: 'from-success to-emerald-500' },
          { label: 'Discrepancies', value: auditCycles.reduce((sum, c) => sum + c.missing + c.damaged, 0).toString(), icon: AlertTriangle, color: 'from-red-500 to-rose-500' },
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
          <input type="text" placeholder="Search audit cycles..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-10 rounded-xl border border-input/50 bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCycles.map((cycle) => (
            <motion.div key={cycle.id} variants={itemVariants}>
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle>{cycle.title}</CardTitle>
                      <Badge variant={cycle.status === 'in_progress' ? 'default' : cycle.status === 'completed' ? 'success' : cycle.status === 'scheduled' ? 'warning' : 'secondary'} size="sm">
                        {cycle.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <CardDescription className="mt-1">
                      {cycle.startDate} - {cycle.endDate}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{cycle.auditor.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 rounded-xl bg-primary/5">
                      <p className="text-2xl font-bold text-primary">{cycle.total}</p>
                      <p className="text-xs text-muted-foreground">Total Assets</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-success/5">
                      <p className="text-2xl font-bold text-success">{cycle.verified}</p>
                      <p className="text-xs text-muted-foreground">Verified</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-destructive/5">
                      <p className="text-2xl font-bold text-destructive">{cycle.missing + cycle.damaged}</p>
                      <p className="text-xs text-muted-foreground">Issues</p>
                    </div>
                  </div>
                  {cycle.status === 'in_progress' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{Math.round((cycle.verified / cycle.total) * 100)}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${(cycle.verified / cycle.total) * 100}%` }} />
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewDetails(cycle.id)}>View Details</Button>
                    <DropdownMenu
                      trigger={<Button variant="ghost" size="icon-sm"><MoreHorizontal className="h-4 w-4" /></Button>}
                      items={[
                        { label: 'View Details', icon: <Eye className="h-4 w-4" />, onClick: () => handleViewDetails(cycle.id) },
                        { label: 'Edit Cycle', icon: <Edit3 className="h-4 w-4" />, onClick: () => alert('Edit cycle form would open here') },
                        { label: 'Delete Cycle', icon: <Trash2 className="h-4 w-4" />, onClick: () => alert('Delete confirmation would appear here'), variant: 'destructive' },
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* New Audit Cycle Modal */}
      <Modal
        isOpen={newCycleModal.isOpen}
        onClose={newCycleModal.close}
        title="New Audit Cycle"
        description="Create a new audit cycle"
        footer={
          <>
            <Button variant="outline" onClick={newCycleModal.close}>Cancel</Button>
            <Button onClick={handleNewCycleSubmit} disabled={!newCycle.title}>Create Cycle</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              placeholder="Enter audit cycle title"
              value={newCycle.title}
              onChange={(e) => setNewCycle(prev => ({ ...prev, title: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Auditor</label>
            <input
              type="text"
              placeholder="Assign auditor"
              value={newCycle.auditor}
              onChange={(e) => setNewCycle(prev => ({ ...prev, auditor: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                value={newCycle.startDate}
                onChange={(e) => setNewCycle(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                value={newCycle.endDate}
                onChange={(e) => setNewCycle(prev => ({ ...prev, endDate: e.target.value }))}
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
        title={selectedCycle?.title || 'Audit Cycle Details'}
        description={`${selectedCycle?.startDate || ''} - ${selectedCycle?.endDate || ''}`}
        size="lg"
        footer={
          <Button variant="outline" onClick={viewDetailsModal.close}>Close</Button>
        }
      >
        {selectedCycle && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge variant={selectedCycle.status === 'in_progress' ? 'default' : selectedCycle.status === 'completed' ? 'success' : selectedCycle.status === 'scheduled' ? 'warning' : 'secondary'} size="sm" className="mt-1">
                  {selectedCycle.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Auditor</p>
                <p className="text-sm font-medium mt-1">{selectedCycle.auditor}</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/5 text-center">
                <p className="text-2xl font-bold text-primary">{selectedCycle.total}</p>
                <p className="text-xs text-muted-foreground">Total Assets</p>
              </div>
              <div className="p-3 rounded-xl bg-success/5 text-center">
                <p className="text-2xl font-bold text-success">{selectedCycle.verified}</p>
                <p className="text-xs text-muted-foreground">Verified</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-destructive/5 text-center">
                <p className="text-2xl font-bold text-destructive">{selectedCycle.missing}</p>
                <p className="text-xs text-muted-foreground">Missing</p>
              </div>
              <div className="p-3 rounded-xl bg-destructive/5 text-center">
                <p className="text-2xl font-bold text-destructive">{selectedCycle.damaged}</p>
                <p className="text-xs text-muted-foreground">Damaged</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Filter Modal */}
      <Modal
        isOpen={filterModal.isOpen}
        onClose={filterModal.close}
        title="Filter Audit Cycles"
        description="Narrow down audit cycles"
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
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="closed">Closed</option>
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
