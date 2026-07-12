import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Package,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MAINTENANCE_STATUS_COLORS, PRIORITY_COLORS } from '@/constants';

const requests = [
  { id: '1', asset: 'Canon iR-ADV C3530', title: 'Paper jam issue', priority: 'high', status: 'in_progress', technician: 'Michael Brown', date: '2024-03-19' },
  { id: '2', asset: 'Projector XPS-200', title: 'Lamp replacement needed', priority: 'medium', status: 'pending_approval', technician: '-', date: '2024-03-18' },
  { id: '3', asset: 'MacBook Pro M3', title: 'Battery swelling', priority: 'critical', status: 'approved', technician: 'Michael Brown', date: '2024-03-17' },
  { id: '4', asset: 'Dell Monitor', title: 'Screen flickering', priority: 'low', status: 'resolved', technician: 'James Wilson', date: '2024-03-15' },
  { id: '5', asset: 'Server Rack', title: 'Cooling fan noise', priority: 'medium', status: 'closed', technician: 'Michael Brown', date: '2024-03-10' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function MaintenancePage() {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance</h1>
          <p className="text-muted-foreground mt-1">Track and manage asset maintenance requests</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>New Request</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Open Requests', value: '18', icon: Wrench, color: 'from-primary to-accent' },
          { label: 'In Progress', value: '7', icon: Clock, color: 'from-accent to-blue-500' },
          { label: 'Critical', value: '3', icon: AlertTriangle, color: 'from-red-500 to-rose-500' },
          { label: 'Resolved This Month', value: '42', icon: CheckCircle2, color: 'from-success to-emerald-500' },
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
              activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'active' ? 'Active Requests' : 'History'}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search maintenance requests..." className="w-full h-10 rounded-xl border border-input/50 bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
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
                  <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Issue</th>
                  <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Priority</th>
                  <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Technician</th>
                  <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.filter(r => activeTab === 'active' ? !['resolved', 'closed'].includes(r.status) : true).map((req) => (
                  <tr key={req.id} className="border-b border-border/50 hover:bg-accent/5 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{req.asset}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{req.title}</td>
                    <td className="py-3 px-4">
                      <Badge variant="default" size="sm" className={PRIORITY_COLORS[req.priority]}>
                        {req.priority}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="default" size="sm" className={MAINTENANCE_STATUS_COLORS[req.status]}>
                        {req.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">{req.technician}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{req.date}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon-sm"><ArrowRight className="h-3.5 w-3.5" /></Button>
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