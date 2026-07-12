import { useState, useEffect } from 'react';
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
  X,
  Loader2,
  Eye,
  Edit3,
  Trash2,
  QrCode as QrCodeIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal, useModal } from '@/components/ui/Modal';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { ASSET_STATUS_COLORS, ASSET_CONDITION_COLORS } from '@/constants';
import { assetService } from '@/services/assetService';
import type { Asset } from '@/types';

// Mock fallback data
const fallbackAssets = [
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
  const [assets, setAssets] = useState(fallbackAssets);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  
  const addAssetModal = useModal();
  const viewDetailsModal = useModal();
  const qrModal = useModal();
  const filterModal = useModal();
  const importModal = useModal();
  const [newAsset, setNewAsset] = useState({ name: '', category: '', serial: '', location: '' });
  const [filterValues, setFilterValues] = useState({ category: '', status: '', condition: '' });

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number | boolean | undefined> = {};
      if (searchQuery) params.search = searchQuery;
      const res = await assetService.list(params);
      if (res.success && res.data) {
        // Transform API data to match our display format
        const apiAssets = (res.data as any[]).map((a: any) => ({
          id: a.id,
          tag: a.assetTag,
          name: a.name,
          category: a.category?.name || a.category || 'N/A',
          serial: a.serialNumber,
          status: a.status,
          condition: a.condition,
          holder: a.currentHolder ? `${a.currentHolder.firstName} ${a.currentHolder.lastName}` : '-',
          department: a.department?.name || a.department || 'N/A',
          location: a.location || 'N/A',
        }));
        setAssets(apiAssets);
      }
    } catch (error) {
      console.error('Failed to fetch assets:', error);
      // Keep fallback data
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Debounced search could be implemented here
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await assetService.export('csv');
      const blob = new Blob([JSON.stringify(res.data)], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `assets-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      // Fallback
      const dataStr = JSON.stringify(assets, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `assets-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        try {
          const res = await fetch('/api/assets/import', { method: 'POST', body: formData });
          if (res.ok) {
            alert('Assets imported successfully');
            fetchAssets();
          }
        } catch (error) {
          console.error('Import failed:', error);
          alert('Failed to import assets. Please check the file format.');
        }
      }
    };
    input.click();
  };

  const handleAddAsset = () => {
    setNewAsset({ name: '', category: '', serial: '', location: '' });
    addAssetModal.open();
  };

  const handleAddAssetSubmit = () => {
    const newId = String(assets.length + 1);
    const newAssetItem = {
      id: newId,
      tag: `AST-${String(assets.length + 1).padStart(3, '0')}`,
      name: newAsset.name,
      category: newAsset.category || 'N/A',
      serial: newAsset.serial,
      status: 'available',
      condition: 'new',
      holder: '-',
      department: 'N/A',
      location: newAsset.location || 'N/A',
    };
    setAssets(prev => [newAssetItem, ...prev]);
    addAssetModal.close();
  };

  const handleViewDetails = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (asset) {
      setSelectedAsset(asset);
      viewDetailsModal.open();
    }
  };

  const handleShowQR = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (asset) {
      setSelectedAsset(asset);
      qrModal.open();
    }
  };

  const handleFilter = () => {
    filterModal.open();
  };

  const handleApplyFilters = () => {
    filterModal.close();
  };

  const filteredAssets = searchQuery
    ? assets.filter(a =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.holder.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : assets;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
          <p className="text-muted-foreground mt-1">Manage and track all organizational assets</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} isLoading={isExporting}>
            <Download className="h-4 w-4 mr-2" />Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleImport}>
            <Upload className="h-4 w-4 mr-2" />Import
          </Button>
          <Button onClick={handleAddAsset}>
            <Plus className="h-4 w-4 mr-2" />Add Asset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Assets', value: assets.length.toString(), icon: Package, color: 'from-primary to-accent' },
          { label: 'Available', value: assets.filter(a => a.status === 'available').length.toString(), icon: Package, color: 'from-success to-emerald-500' },
          { label: 'Allocated', value: assets.filter(a => a.status === 'allocated').length.toString(), icon: Package, color: 'from-accent to-blue-500' },
          { label: 'Under Maintenance', value: assets.filter(a => a.status === 'under_maintenance').length.toString(), icon: Package, color: 'from-amber-500 to-orange-500' },
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
            onChange={handleSearch}
            className="w-full h-10 rounded-xl border border-input/50 bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        <Button variant="outline" onClick={handleFilter}>
          <Filter className="h-4 w-4 mr-2" />Filter
        </Button>
        <Button variant="outline" onClick={() => setShowAdvanced(!showAdvanced)}>
          <SlidersHorizontal className="h-4 w-4 mr-2" />Advanced
        </Button>
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

      {showAdvanced && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex items-center gap-4 flex-wrap">
            <select className="h-9 rounded-lg border border-input/50 bg-background px-3 text-sm">
              <option value="">All Categories</option>
              <option value="Laptop">Laptop</option>
              <option value="Monitor">Monitor</option>
              <option value="Printer">Printer</option>
              <option value="Mobile">Mobile</option>
              <option value="Server">Server</option>
            </select>
            <select className="h-9 rounded-lg border border-input/50 bg-background px-3 text-sm">
              <option value="">All Statuses</option>
              <option value="available">Available</option>
              <option value="allocated">Allocated</option>
              <option value="under_maintenance">Under Maintenance</option>
              <option value="retired">Retired</option>
            </select>
            <select className="h-9 rounded-lg border border-input/50 bg-background px-3 text-sm">
              <option value="">All Conditions</option>
              <option value="new">New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
            </select>
            <Button variant="outline" size="sm" onClick={() => {}}>Apply Filters</Button>
            <Button variant="ghost" size="sm" onClick={() => setShowAdvanced(false)}>Close</Button>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : viewMode === 'grid' ? (
        <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => (
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
                    <Button variant="ghost" size="sm" className="flex-1" onClick={() => handleViewDetails(asset.id)}>View Details</Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => handleShowQR(asset.id)}><QrCode className="h-4 w-4" /></Button>
                    <DropdownMenu
                      trigger={<Button variant="ghost" size="icon-sm"><MoreHorizontal className="h-4 w-4" /></Button>}
                      items={[
                        { label: 'View Details', icon: <Eye className="h-4 w-4" />, onClick: () => handleViewDetails(asset.id) },
                        { label: 'Show QR Code', icon: <QrCodeIcon className="h-4 w-4" />, onClick: () => handleShowQR(asset.id) },
                        { label: 'Edit Asset', icon: <Edit3 className="h-4 w-4" />, onClick: () => alert('Edit asset form would open here') },
                        { label: 'Delete Asset', icon: <Trash2 className="h-4 w-4" />, onClick: () => alert('Delete confirmation would appear here'), variant: 'destructive' },
                      ]}
                    />
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
                  {filteredAssets.map((asset) => (
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
                          <Button variant="ghost" size="icon-sm" onClick={() => handleShowQR(asset.id)}><QrCode className="h-3.5 w-3.5" /></Button>
                          <DropdownMenu
                            trigger={<Button variant="ghost" size="icon-sm"><MoreHorizontal className="h-3.5 w-3.5" /></Button>}
                            items={[
                              { label: 'Show QR Code', icon: <QrCodeIcon className="h-3.5 w-3.5" />, onClick: () => handleShowQR(asset.id) },
                              { label: 'Edit Asset', icon: <Edit3 className="h-3.5 w-3.5" />, onClick: () => alert('Edit asset form would open here') },
                              { label: 'Delete Asset', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: () => alert('Delete confirmation would appear here'), variant: 'destructive' },
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

      {/* Add Asset Modal */}
      <Modal
        isOpen={addAssetModal.isOpen}
        onClose={addAssetModal.close}
        title="Add New Asset"
        description="Enter the details for the new asset"
        footer={
          <>
            <Button variant="outline" onClick={addAssetModal.close}>Cancel</Button>
            <Button onClick={handleAddAssetSubmit} disabled={!newAsset.name}>Add Asset</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Asset Name *</label>
            <input
              type="text"
              placeholder="Enter asset name"
              value={newAsset.name}
              onChange={(e) => setNewAsset(prev => ({ ...prev, name: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={newAsset.category}
              onChange={(e) => setNewAsset(prev => ({ ...prev, category: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select category</option>
              <option value="Laptop">Laptop</option>
              <option value="Monitor">Monitor</option>
              <option value="Printer">Printer</option>
              <option value="Mobile">Mobile</option>
              <option value="Server">Server</option>
              <option value="AV Equipment">AV Equipment</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Serial Number</label>
            <input
              type="text"
              placeholder="Enter serial number"
              value={newAsset.serial}
              onChange={(e) => setNewAsset(prev => ({ ...prev, serial: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              placeholder="Enter location"
              value={newAsset.location}
              onChange={(e) => setNewAsset(prev => ({ ...prev, location: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={viewDetailsModal.isOpen}
        onClose={viewDetailsModal.close}
        title={selectedAsset?.name || 'Asset Details'}
        description={`Tag: ${selectedAsset?.tag || ''}`}
        size="lg"
        footer={
          <Button variant="outline" onClick={viewDetailsModal.close}>Close</Button>
        }
      >
        {selectedAsset && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge variant="default" size="sm" className={`mt-1 ${ASSET_STATUS_COLORS[selectedAsset.status]}`}>
                  {selectedAsset.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Condition</p>
                <Badge variant="default" size="sm" className={`mt-1 ${ASSET_CONDITION_COLORS[selectedAsset.condition]}`}>
                  {selectedAsset.condition}
                </Badge>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="text-sm font-medium mt-1">{selectedAsset.category}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Serial Number</p>
                <p className="text-sm font-medium mt-1">{selectedAsset.serial}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Holder</p>
                <p className="text-sm font-medium mt-1">{selectedAsset.holder}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">Department</p>
                <p className="text-sm font-medium mt-1">{selectedAsset.department}</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-muted/50">
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium mt-1">{selectedAsset.location}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* QR Code Modal */}
      <Modal
        isOpen={qrModal.isOpen}
        onClose={qrModal.close}
        title="Asset QR Code"
        description={selectedAsset?.name || ''}
        size="sm"
        footer={
          <Button variant="outline" onClick={qrModal.close}>Close</Button>
        }
      >
        <div className="flex flex-col items-center py-4">
          <div className="h-48 w-48 rounded-xl bg-primary/5 flex items-center justify-center border-2 border-dashed border-primary/30">
            <QrCodeIcon className="h-24 w-24 text-primary/40" />
          </div>
          <p className="text-sm text-muted-foreground mt-4">{selectedAsset?.tag}</p>
          <p className="text-xs text-muted-foreground">Scan to view asset details</p>
        </div>
      </Modal>

      {/* Filter Modal */}
      <Modal
        isOpen={filterModal.isOpen}
        onClose={filterModal.close}
        title="Filter Assets"
        description="Narrow down assets by criteria"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => { setFilterValues({ category: '', status: '', condition: '' }); filterModal.close(); }}>Clear Filters</Button>
            <Button onClick={handleApplyFilters}>Apply Filters</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={filterValues.category}
              onChange={(e) => setFilterValues(prev => ({ ...prev, category: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Categories</option>
              <option value="Laptop">Laptop</option>
              <option value="Monitor">Monitor</option>
              <option value="Printer">Printer</option>
              <option value="Mobile">Mobile</option>
              <option value="Server">Server</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={filterValues.status}
              onChange={(e) => setFilterValues(prev => ({ ...prev, status: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Statuses</option>
              <option value="available">Available</option>
              <option value="allocated">Allocated</option>
              <option value="under_maintenance">Under Maintenance</option>
              <option value="retired">Retired</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Condition</label>
            <select
              value={filterValues.condition}
              onChange={(e) => setFilterValues(prev => ({ ...prev, condition: e.target.value }))}
              className="w-full h-10 rounded-xl border border-input/50 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Conditions</option>
              <option value="new">New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
