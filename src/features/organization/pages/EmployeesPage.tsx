import { useState } from 'react';
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
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const employees = [
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
          <Button leftIcon={<Plus className="h-4 w-4" />}>Add Employee</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Employees', value: '156', icon: Users, color: 'from-primary to-accent' },
          { label: 'Active', value: '142', icon: Users, color: 'from-success to-emerald-500' },
          { label: 'Departments', value: '12', icon: Users, color: 'from-accent to-blue-500' },
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
        </div>
        <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>Filter</Button>
        <Button variant="outline" leftIcon={<ChevronDown className="h-4 w-4" />}>Department</Button>
      </div>

      {viewMode === 'grid' ? (
        <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {employees.map((emp) => (
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
                      <Button variant="ghost" size="sm">View Profile</Button>
                      <Button variant="ghost" size="icon-sm"><MoreHorizontal className="h-4 w-4" /></Button>
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
                  {employees.map((emp) => (
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
                        <Button variant="ghost" size="icon-sm"><MoreHorizontal className="h-4 w-4" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}