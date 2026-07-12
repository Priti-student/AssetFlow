import { useState } from 'react';
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
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const allocations = [
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

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Allocations</h1>
          <p className="text-muted-foreground mt-1">Manage asset allocations and track returns</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>New Allocation</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Allocations', value: '342', icon: ArrowRightLeft, color: 'from-primary to-accent' },
          { label: 'Overdue Returns', value: '12', icon: Clock, color: 'from-red-500 to-rose-500' },
          { label: 'Returned This Month', value: '48', icon: CheckCircle2, color: 'from-success to-emerald-500' },
          { label: 'Total Allocations', value: '1,847', icon: Package, color: 'from-accent to-blue-500' },
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
          <input type="text" placeholder="Search allocations..." className="w-full h-10 rounded-xl border border-input/50 bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>Filter</Button>
      </div>

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
                {allocations.filter(a => activeTab === 'active' ? a.status !== 'returned' : true).map((alloc) => (
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
                        <Button variant="ghost" size="icon-sm"><CheckCircle2 className="h-3.5 w-3.5 text-success" /></Button>
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