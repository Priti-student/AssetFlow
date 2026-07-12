import { useState } from 'react';
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
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const auditCycles = [
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

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit</h1>
          <p className="text-muted-foreground mt-1">Manage audit cycles and verify asset records</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>New Audit Cycle</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Audits', value: '1', icon: ClipboardCheck, color: 'from-primary to-accent' },
          { label: 'Scheduled', value: '3', icon: Clock, color: 'from-accent to-blue-500' },
          { label: 'Completed', value: '12', icon: CheckCircle2, color: 'from-success to-emerald-500' },
          { label: 'Discrepancies', value: '10', icon: AlertTriangle, color: 'from-red-500 to-rose-500' },
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
        <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>Filter</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {auditCycles.map((cycle) => (
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
                  <Button variant="outline" size="sm" className="flex-1">View Details</Button>
                  <Button variant="ghost" size="icon-sm"><MoreHorizontal className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}