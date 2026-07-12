import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Grid3X3,
  List,
  QrCode,
  Download,
  Upload,
  SlidersHorizontal,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ASSET_STATUS_COLORS, ASSET_CONDITION_COLORS } from '@/constants';

const assets = [
  { id: '1', tag: 'AST-001', name: 'MacBook Pro M3', category: 'Laptop', serial: 'MBP-M3-2024-001', status: 'allocated', condition: 'new', holder: 'Sarah Chen', department: 'IT', location: 'Floor 3, Desk 7A' },
  { id: '2', tag: 'AST-002', name: 'Dell UltraSharp Monitor', category: 'Monitor', serial: 'Dell-US-27-002', status: 'available', condition: 'good', holder: '-', department: 'IT', location: 'Storage Room B' },
  { id: '3', tag: 'AST-003', name: 'Canon iR-ADV C3530', category: 'Printer', serial: 'CN-C3530-003', status: 'under_maintenance', condition: 'fair', holder: '-', department: 'Operations', location: 'Floor 2, Print Room' },
  { id: '4', tag: 'AST-004', name: 'Projector XPS-200', category: 'AV Equipment', serial: 'XPS-200-004', status: 'available', condition: 'good', holder: '-', department: 'Conference', location: 'Meeting Room A' },
  { id: '5', tag: 'AST-005', name: 'iPhone 15 Pro', category: 'Mobile', serial: 'IP15P-005', status: 'allocated', condition: 'new', holder: 'James Wilson', department: 'Engineering', location: 'Floor 4, Desk 12B' },
  { id: '6', tag: 'AST-006', name: 'Server Rack - Dell PowerEdge', category: 'Server', serial: 'PE-R740-006', status: 'available', condition: 'good', holder: '-', department: 'IT', location: 'Server Room' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function AssetDirectoryPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
          <p className="text-muted-foreground mt-1">Manage and track all organizational assets</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>Export</Button>
          <Button variant="outline" size="sm" leftIcon={<Upload className="h-4 w-4" />}>Import</Button>
          <Button leftIcon={<Plus className="h-4 w-4" />}>Add Asset</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Assets', value: '2,847', icon: Package, color: 'from-primary to-accent' },
          { label: 'Available', value: '912', icon: Package, color: 'from-success to-emerald-500' },
          { label: 'Allocated', value: '1,423', icon: Package, color: 'from-accent to-blue-500' },
          { label: 'Under Maintenance', value: '24', icon: Package, color: 'from-amber-500 to-orange-500' },
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
            placeholder="Search by name, tag, serial number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 rounded-xl border border-input/50 bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>Filter</Button>
        <Button variant="outline" leftIcon={<SlidersHorizontal className="h-4 w-4" />}>Advanced</Button>
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
      </div>

      {viewMode === 'grid' ? (
        <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {assets.map((asset) => (
            <motion.div key={asset.id} variants={itemVariants}>
              <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="default" size="sm" className={ASSET_STATUS_COLORS[asset.status]}>
                      {asset.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm">{asset.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{asset.tag}</p>
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium">{asset.category}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Holder</span>
                      <span className="font-medium">{asset.holder}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Condition</span>
                      <Badge variant="default" size="sm" className={ASSET_CONDITION_COLORS[asset.condition]}>
                        {asset.condition}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="flex-1">View Details</Button>
                    <Button variant="ghost" size="icon-sm"><QrCode className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon-sm"><MoreHorizontal className="h-4 w-4" /></Button>
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
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Asset</th>
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Holder</th>
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</th>
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</th>
                    <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset) => (
                    <tr key={asset.id} className="border-b border-border/50 hover:bg-accent/5 transition-colors group">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Package className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{asset.name}</p>
                            <p className="text-xs text-muted-foreground">{asset.tag}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{asset.category}</td>
                      <td className="py-3 px-4">
                        <Badge variant="default" size="sm" className={ASSET_STATUS_COLORS[asset.status]}>
                          {asset.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">{asset.holder}</td>
                      <td className="py-3 px-4 text-sm">{asset.department}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{asset.location}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon-sm"><QrCode className="h-3.5 w-3.5" /></Button>
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
      )}
    </motion.div>
  );
}