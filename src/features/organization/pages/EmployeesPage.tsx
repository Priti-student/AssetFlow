import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  Grid3X3,
  List,
  Table2,
  X,
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
import { employeeService } from '@/services/employeeService';

const fallbackEmployees = [
  { id: '1', name: 'Sarah Chen', role: 'asset_manager', email: 'sarah.chen@company.com', department: 'IT', status: 'active', avatar: 'SC' },
  { id: '2', name: 'James Wilson', role: 'department_head', email: 'james.wilson@company.com', department: 'Engineering', status: 'active', avatar: 'JW' },
  { id: '3', name: 'Emily Davis', role: 'employee', email: 'emily.davis@company.com', department: 'Marketing', status: 'active', avatar: 'ED' },
  { id: '4', name: 'Michael Brown', role: 'technician', email: 'michael.brown@company.com', department: 'IT', status: 'active', avatar: 'MB' },
  { id: '5', name: 'Lisa Anderson', role: 'auditor', email: 'lisa.anderson@company.com', department: 'Finance', status: 'active', avatar: 'LA' },
  { id: '6', name: 'David Lee', role: 'employee', email: 'david.lee@company.com', department: 'R&D', status: 'inactive', avatar: 'DL' },
  { id: '7', name: 'Robert Brown', role: 'admin', email: 'robert.brown@company.com', department: 'Management', status: 'active', avatar: 'RB' },
  { id: '8', name: 'Anna Martinez', role: 'employee', email: 'anna.martinez@company.com', department: 'HR', status: 'active', avatar: 'AM' },
];

const roleColors: Record<string, string> = {
  admin: 'from-purple-500 to-pink-500',
  asset_manager: 'from-primary to-accent',
  department_head: 'from-secondary to-emerald-500',
  employee: 'from-blue-500 to-indigo-500',
  technician: 'from-amber-500 to-orange-500',
  auditor: 'from-rose-500 to-red-500',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function EmployeesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState(fallbackEmployees);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', role: 'employee', department: '' });

  const addEmployeeModal = useModal();
  const viewProfileModal = useModal();
  const filterModal = useModal();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await employeeService.list();
      if (res.success && res.data) {
        const apiEmps = (res.data as any[]).map((e: any) => ({
          id: e.id,
          name: `${e.firstName ?? ''} ${e.lastName ?? ''}`.trim() || e.name || 'N/A',
          role: e.role,
          email: e.email,
          department: e.department?.name || e.department || 'N/A',
          status: e.isActive ? 'active' : 'inactive',
          avatar: ((e.firstName?.[0] ?? '') + (e.lastName?.[0] ?? '')).trim() || 'NA',
        }));
        setEmployees(apiEmps);
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = () => {
    setNewEmployee({ name: '', email: '', role: 'employee', department: '' });
    addEmployeeModal.open();
  };

  const handleAddEmployeeSubmit = () => {
    const newId = String(employees.length + 1);
    const initials = newEmployee.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'NA';
    const newItem = {
      id: newId,
      name: newEmployee.name || 'New Employee',
      role: newEmployee.role,
      email: newEmployee.email || 'email@company.com',
      department: newEmployee.department || 'N/A',
      status: 'active' as const,
      avatar: initials,
    };
    setEmployees(prev => [...prev, newItem]);
    addEmployeeModal.close();
  };

  const handleViewProfile = (empId: string) => {
    const emp = employees.find(e => e.id === empId);
    if (emp) {
      setSelectedEmployee(emp);
      viewProfileModal.open();
    }
  };

  const handleDepartmentFilter = () => {
    filterModal.open();
  };

  const filteredEmployees = searchQuery
    ? employees.filter(e =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : employees;

  const activeCount = employees.filter(e => e.status === 'active').length;
  const departmentsCount = [...new Set(employees.map(e => e.department))].length;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground mt-1">Manage your organization's workforce</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border/50 p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <Button onClick={handleAddEmployee}>
            <Plus className="h-4 w-4 mr-2" />Add Employee
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Employees', value: employees.length.toString(), icon: Users, color: 'from-primary to-accent' },
          { label: 'Active', value: activeCount.toString(), icon: Users, color: 'from-success to-emerald-500' },
          { label: 'Departments', value: departmentsCount.toString(), icon: Users, color: 'from-accent to-blue-500' },
          { label: 'New This Month', value: '8', icon: Users, color: 'from-secondary to-emerald-500' },
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
          <input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 rounded-xl border border-input/50 bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        <Button variant="outline" onClick={() => filterModal.open()}>
          <Filter className="h-4 w-4 mr-2" />Filter
        </Button>
        <Button variant="outline" onClick={handleDepartmentFilter}>
          <ChevronDown className="h-4 w-4 mr-2" />Department
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : viewMode === 'grid' ? (
        <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEmployees.map((emp) => (
            <motion.div key={emp.id} variants={itemVariants}>
              <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex flex-col items-center text-center">
                    <div className={`h-14 w-14 rounded-full bg-gradient-to-br ${roleColors[emp.role]} flex items-center justify-center mb-3`}>
                      <span className="text-lg font-bold text-white">{emp.avatar}</span>
                    </div>
                    <h3 className="font-semibold">{emp.name}</h3>
                    <Badge variant="default" size="sm" className="mt-1 capitalize">{emp.role.replace('_', ' ')}</Badge>
                    <p className="text-xs text-muted-foreground mt-2">{emp.department}</p>
                    <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {emp.email}
                    </div>
                    <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" onClick={() => handleViewProfile(emp.id)}>View Profile</Button>
                      <DropdownMenu
                        trigger={<Button variant="ghost" size="icon-sm"><MoreHorizontal className="h-4 w-4" /></Button>}
                        items={[
                          { label: 'View Profile', icon: <Eye className="h-4 w-4" />, onClick: () => handleViewProfile(emp.id) },
                          { label: 'Edit Employee', icon: <Edit3 className="h-4 w-4" />, onClick: () => alert('Edit employee form would open here') },
                          { label: 'Deactivate', icon: <Trash2 className="h-4 w-4" />, onClick: () => alert('Confirm deactivation would appear here'), variant: 'destructive' },
                        ]}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 text-left">
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Employee</th>
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</th>
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="border-b border-border/50 hover:bg-accent/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${roleColors[emp.role]} flex items-center justify-center`}>
                            <span className="text-xs font-bold text-white">{emp.avatar}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{emp.name}</p>
                            <p className="text-xs text-muted-foreground">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="default" size="sm" className="capitalize">{emp.role.replace('_', ' ')}</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">{emp.department}</td>
                      <td className="py-3 px-4">
                        <Badge variant={emp.status === 'active' ? 'success' : 'warning'} size="sm">{emp.status}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon-sm" onClick={() => handleViewProfile(emp.id)}><Users className="h-3.5 w-3.5" /></Button>
                          <DropdownMenu
                            trigger={<Button variant="ghost" size="icon-sm"><MoreHorizontal className="h-3.5 w-3.5" /></Button>}
                            items={[
                              { label: 'View Profile', icon: <Eye className="h-3.5 w-3.5" />, onClick: () => handleViewProfile(emp.id) },
                              { label: 'Edit Employee', icon: <Edit3 className="h-3.5 w-3.5" />, onClick: () => alert('Edit employee form would open here') },
                              { label: 'Deactivate', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: () => alert('Confirm deactivation would appear here'), variant: 'destructive' },
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

      {/* Add Employee Modal */}
      <Modal
        isOpen={addEmployeeModal.isOpen}
        onClose={addEmployeeModal.close}
        title="Add Employee"
        description="Add a new employee to the organization"
        footer={
          <>
            <Button variant="outline" onClick={addEmployeeModal.close}>Cancel</Button>
            <Button onClick={handleAddEmployeeSubmit} disabled={!newEmployee.name}>Add Employee</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name *</label>
            <input
              type="text"
              placeholder="Enter employee name"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter email address"
              value={newEmployee.email}
              onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              value={newEmployee.role}
              onChange={(e) => setNewEmployee(prev => ({ ...prev, role: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="employee">Employee</option>
              <option value="asset_manager">Asset Manager</option>
              <option value="department_head">Department Head</option>
              <option value="technician">Technician</option>
              <option value="auditor">Auditor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <input
              type="text"
              placeholder="Enter department"
              value={newEmployee.department}
              onChange={(e) => setNewEmployee(prev => ({ ...prev, department: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </Modal>

      {/* View Profile Modal */}
      <Modal
        isOpen={viewProfileModal.isOpen}
        onClose={viewProfileModal.close}
        title={selectedEmployee?.name || 'Employee Profile'}
        description={selectedEmployee?.email || ''}
        size="lg"
        footer={
          <Button variant="outline" onClick={viewProfileModal.close}>Close</Button>
        }
      >
        {selectedEmployee && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className={`h-16 w-16 rounded-full bg-gradient-to-br ${roleColors[selectedEmployee.role]} flex items-center justify-center`}>
                <span className="text-2xl font-bold text-white">{selectedEmployee.avatar}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{selectedEmployee.name}</h3>
                <Badge variant="default" size="sm" className="mt-1 capitalize">{selectedEmployee.role.replace('_', ' ')}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium mt-1">{selectedEmployee.email}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Department</p>
                <p className="text-sm font-medium mt-1">{selectedEmployee.department}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge variant={selectedEmployee.status === 'active' ? 'success' : 'warning'} size="sm" className="mt-1">{selectedEmployee.status}</Badge>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Filter Modal */}
      <Modal
        isOpen={filterModal.isOpen}
        onClose={filterModal.close}
        title="Filter Employees"
        description="Narrow down employees by criteria"
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
            <label className="block text-sm font-medium mb-1">Department</label>
            <select className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">All Departments</option>
              <option value="IT">IT</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="HR">HR</option>
              <option value="R&D">R&D</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="asset_manager">Asset Manager</option>
              <option value="department_head">Department Head</option>
              <option value="employee">Employee</option>
              <option value="technician">Technician</option>
              <option value="auditor">Auditor</option>
            </select>
          </div>
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
