import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit3,
  Trash2,
  Users,
  Package,
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
  X,
  Loader2,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal, useModal } from '@/components/ui/Modal';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { departmentService } from '@/services/departmentService';

const fallbackDepartments = [
  { id: '1', name: 'Information Technology', code: 'IT', head: 'Sarah Chen', employees: 45, assets: 320, status: 'active', children: [
    { id: '1a', name: 'Software Development', code: 'IT-SD', head: 'James Wilson', employees: 20, assets: 120, status: 'active' },
    { id: '1b', name: 'Infrastructure', code: 'IT-INF', head: 'Mike Johnson', employees: 15, assets: 150, status: 'active' },
  ]},
  { id: '2', name: 'Human Resources', code: 'HR', head: 'Emily Davis', employees: 12, assets: 45, status: 'active' },
  { id: '3', name: 'Finance', code: 'FIN', head: 'Robert Brown', employees: 18, assets: 60, status: 'active' },
  { id: '4', name: 'Operations', code: 'OPS', head: 'Lisa Anderson', employees: 30, assets: 180, status: 'active' },
  { id: '5', name: 'Research & Development', code: 'R&D', head: 'David Lee', employees: 25, assets: 200, status: 'active' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function DepartmentRow({ dept, depth = 0, onEdit, onDelete, onView }: { dept: any; depth?: number; onEdit: (id: string) => void; onDelete: (id: string) => void; onView: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = dept.children?.length > 0;

  return (
    <>
      <tr className="group border-b border-border/50 hover:bg-accent/5 transition-colors">
        <td className="py-3 px-4">
          <div className="flex items-center gap-3" style={{ paddingLeft: `${depth * 24}px` }}>
            {hasChildren ? (
              <button onClick={() => setExpanded(!expanded)} className="p-0.5 hover:bg-accent/10 rounded">
                {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            ) : <div className="w-5" />}
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{dept.name}</p>
                <p className="text-xs text-muted-foreground">{dept.code}</p>
              </div>
            </div>
          </div>
        </td>
        <td className="py-3 px-4 text-sm">{dept.head}</td>
        <td className="py-3 px-4">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            {dept.employees}
          </div>
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center gap-2 text-sm">
            <Package className="h-3.5 w-3.5 text-muted-foreground" />
            {dept.assets}
          </div>
        </td>
        <td className="py-3 px-4">
          <Badge variant="success" size="sm">{dept.status}</Badge>
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon-sm" onClick={() => onEdit(dept.id)}><Edit3 className="h-3.5 w-3.5" /></Button>
            <Button variant="ghost" size="icon-sm" onClick={() => onDelete(dept.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
            <DropdownMenu
              trigger={<Button variant="ghost" size="icon-sm"><MoreHorizontal className="h-3.5 w-3.5" /></Button>}
              items={[
                { label: 'View Details', icon: <Eye className="h-3.5 w-3.5" />, onClick: () => onView(dept.id) },
                { label: 'Edit Department', icon: <Edit3 className="h-3.5 w-3.5" />, onClick: () => onEdit(dept.id) },
                { label: 'Delete Department', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: () => onDelete(dept.id), variant: 'destructive' },
              ]}
            />
          </div>
        </td>
      </tr>
      {hasChildren && expanded && dept.children.map((child: any) => (
        <DepartmentRow key={child.id} dept={child} depth={depth + 1} onEdit={onEdit} onDelete={onDelete} onView={onView} />
      ))}
    </>
  );
}

export function DepartmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [departments, setDepartments] = useState(fallbackDepartments);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState<any>(null);
  const [newDept, setNewDept] = useState({ name: '', code: '', head: '' });

  const addDeptModal = useModal();
  const editDeptModal = useModal();
  const viewDeptModal = useModal();
  const filterModal = useModal();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await departmentService.list();
      if (res.success && res.data) {
        const apiDepts = (res.data as any[]).map(d => ({
          id: d.id,
          name: d.name,
          code: d.code,
          head: d.head ? `${d.head.firstName} ${d.head.lastName}` : 'N/A',
          employees: d.employeeCount ?? d._count?.employees ?? 0,
          assets: d.assetCount ?? d._count?.assets ?? 0,
          status: d.isActive ? 'active' : 'inactive',
          children: d.children?.map((c: any) => ({
            id: c.id,
            name: c.name,
            code: c.code,
            head: c.head ? `${c.head.firstName} ${c.head.lastName}` : 'N/A',
            employees: c.employeeCount ?? 0,
            assets: c.assetCount ?? 0,
            status: c.isActive ? 'active' : 'inactive',
          })) || [],
        }));
        setDepartments(apiDepts);
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = () => {
    setNewDept({ name: '', code: '', head: '' });
    addDeptModal.open();
  };

  const handleAddDeptSubmit = () => {
    const newId = String(departments.length + 1);
    const newItem = {
      id: newId,
      name: newDept.name || 'New Department',
      code: newDept.code || 'NEW',
      head: newDept.head || 'Unassigned',
      employees: 0,
      assets: 0,
      status: 'active',
    };
    setDepartments(prev => [...prev, newItem]);
    addDeptModal.close();
  };

  const handleEdit = (id: string) => {
    const dept = departments.find(d => d.id === id);
    if (dept) {
      setSelectedDept(dept);
      setNewDept({ name: dept.name, code: dept.code, head: dept.head });
      editDeptModal.open();
    }
  };

  const handleEditDeptSubmit = () => {
    if (selectedDept) {
      setDepartments(prev => prev.map(d => d.id === selectedDept.id ? { ...d, name: newDept.name, code: newDept.code, head: newDept.head } : d));
      editDeptModal.close();
    }
  };

  const handleViewDept = (id: string) => {
    const dept = departments.find(d => d.id === id);
    if (dept) {
      setSelectedDept(dept);
      viewDeptModal.open();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
      try {
        await departmentService.delete(id);
        setDepartments(prev => prev.filter(d => d.id !== id));
      } catch (error) {
        console.error('Failed to delete department:', error);
        alert('Failed to delete department. Please try again.');
      }
    }
  };

  const handleFilter = () => {
    filterModal.open();
  };

  const filteredDepartments = searchQuery
    ? departments.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.head.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : departments;

  const totalEmployees = departments.reduce((sum, d) => sum + d.employees, 0);
  const totalAssets = departments.reduce((sum, d) => sum + d.assets, 0);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground mt-1">Manage organizational departments and hierarchy</p>
        </div>
        <Button onClick={handleAddDepartment}>
          <Plus className="h-4 w-4 mr-2" />Add Department
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Departments', value: departments.length.toString(), icon: Building2, color: 'from-primary to-accent' },
          { label: 'Active Departments', value: departments.filter(d => d.status === 'active').length.toString(), icon: Building2, color: 'from-success to-emerald-500' },
          { label: 'Total Employees', value: totalEmployees.toString(), icon: Users, color: 'from-accent to-blue-500' },
          { label: 'Department Assets', value: totalAssets.toLocaleString(), icon: Package, color: 'from-secondary to-emerald-500' },
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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Departments</CardTitle>
              <CardDescription>View and manage all departments in your organization</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search departments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-48 rounded-lg border border-input/50 bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2">
                    <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={handleFilter}>
                <Filter className="h-4 w-4 mr-2" />Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 text-left">
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</th>
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Head</th>
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Employees</th>
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Assets</th>
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDepartments.map((dept) => (
                    <DepartmentRow key={dept.id} dept={dept} onEdit={handleEdit} onDelete={handleDelete} onView={handleViewDept} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Department Modal */}
      <Modal
        isOpen={addDeptModal.isOpen}
        onClose={addDeptModal.close}
        title="Add Department"
        description="Create a new department"
        footer={
          <>
            <Button variant="outline" onClick={addDeptModal.close}>Cancel</Button>
            <Button onClick={handleAddDeptSubmit} disabled={!newDept.name}>Add Department</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Department Name *</label>
            <input
              type="text"
              placeholder="Enter department name"
              value={newDept.name}
              onChange={(e) => setNewDept(prev => ({ ...prev, name: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Code</label>
            <input
              type="text"
              placeholder="e.g. IT, HR, FIN"
              value={newDept.code}
              onChange={(e) => setNewDept(prev => ({ ...prev, code: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Department Head</label>
            <input
              type="text"
              placeholder="Enter head's name"
              value={newDept.head}
              onChange={(e) => setNewDept(prev => ({ ...prev, head: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </Modal>

      {/* Edit Department Modal */}
      <Modal
        isOpen={editDeptModal.isOpen}
        onClose={editDeptModal.close}
        title="Edit Department"
        description={selectedDept?.name || ''}
        footer={
          <>
            <Button variant="outline" onClick={editDeptModal.close}>Cancel</Button>
            <Button onClick={handleEditDeptSubmit} disabled={!newDept.name}>Save Changes</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Department Name *</label>
            <input
              type="text"
              placeholder="Enter department name"
              value={newDept.name}
              onChange={(e) => setNewDept(prev => ({ ...prev, name: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Code</label>
            <input
              type="text"
              placeholder="e.g. IT, HR, FIN"
              value={newDept.code}
              onChange={(e) => setNewDept(prev => ({ ...prev, code: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Department Head</label>
            <input
              type="text"
              placeholder="Enter head's name"
              value={newDept.head}
              onChange={(e) => setNewDept(prev => ({ ...prev, head: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </Modal>

      {/* View Department Modal */}
      <Modal
        isOpen={viewDeptModal.isOpen}
        onClose={viewDeptModal.close}
        title={selectedDept?.name || 'Department Details'}
        description={`Code: ${selectedDept?.code || ''}`}
        size="lg"
        footer={
          <Button variant="outline" onClick={viewDeptModal.close}>Close</Button>
        }
      >
        {selectedDept && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Head</p>
                <p className="text-sm font-medium mt-1">{selectedDept.head}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge variant="success" size="sm" className="mt-1">{selectedDept.status}</Badge>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Employees</p>
                <p className="text-sm font-medium mt-1">{selectedDept.employees}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Assets</p>
                <p className="text-sm font-medium mt-1">{selectedDept.assets}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Filter Modal */}
      <Modal
        isOpen={filterModal.isOpen}
        onClose={filterModal.close}
        title="Filter Departments"
        description="Narrow down departments"
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
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}