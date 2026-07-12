import { useState } from 'react';
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
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';

const departments = [
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

function DepartmentRow({ dept, depth = 0 }: { dept: typeof departments[0]; depth?: number }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = (dept as any).children?.length > 0;

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
            <Button variant="ghost" size="icon-sm"><Edit3 className="h-3.5 w-3.5" /></Button>
            <Button variant="ghost" size="icon-sm"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
            <Button variant="ghost" size="icon-sm"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
          </div>
        </td>
      </tr>
      {hasChildren && expanded && (dept as any).children.map((child: any) => (
        <DepartmentRow key={child.id} dept={child} depth={depth + 1} />
      ))}
    </>
  );
}

export function DepartmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground mt-1">Manage organizational departments and hierarchy</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>Add Department</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Departments', value: '12', icon: Building2, color: 'from-primary to-accent' },
          { label: 'Active Departments', value: '10', icon: Building2, color: 'from-success to-emerald-500' },
          { label: 'Total Employees', value: '245', icon: Users, color: 'from-accent to-blue-500' },
          { label: 'Department Assets', value: '1,847', icon: Package, color: 'from-secondary to-emerald-500' },
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
              </div>
              <Button variant="outline" size="sm" leftIcon={<Filter className="h-4 w-4" />}>Filter</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
                {departments.map((dept) => (
                  <DepartmentRow key={dept.id} dept={dept} />
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}