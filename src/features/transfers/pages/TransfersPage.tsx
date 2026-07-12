import { useState } from 'react';
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
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const transfers = [
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

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transfers</h1>
          <p className="text-muted-foreground mt-1">Manage asset transfers between employees and departments</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>New Transfer</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending Transfers', value: '8', icon: GitCompareArrows, color: 'from-primary to-accent' },
          { label: 'Approved', value: '5', icon: CheckCircle2, color: 'from-success to-emerald-500' },
          { label: 'Completed', value: '124', icon: GitCompareArrows, color: 'from-accent to-blue-500' },
          { label: 'Rejected', value: '3', icon: XCircle, color: 'from-red-500 to-rose-500' },
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
        <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>Filter</Button>
      </div>

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
                {transfers.map((transfer) => (
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
                          <Button variant="ghost" size="icon-sm"><CheckCircle2 className="h-3.5 w-3.5 text-success" /></Button>
                          <Button variant="ghost" size="icon-sm"><XCircle className="h-3.5 w-3.5 text-destructive" /></Button>
                          <Button variant="ghost" size="icon-sm"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
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
    </motion.div>
  );
}