import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Shield,
  Bell,
  Palette,
  Database,
  Key,
  Globe,
  Users,
  RefreshCw,
  Save,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';

const tabs = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'theme', label: 'Appearance', icon: Palette },
  { id: 'integrations', label: 'Integrations', icon: Globe },
  { id: 'backup', label: 'Backup', icon: Database },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage system configuration and preferences</p>
        </div>
        <Button leftIcon={<Save className="h-4 w-4" />}>Save Changes</Button>
      </div>

      <div className="flex gap-6">
        <div className="w-56 shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent/5 hover:text-foreground'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 space-y-6">
          {activeTab === 'general' && (
            <motion.div variants={itemVariants} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Configure basic system settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input label="Organization Name" placeholder="Enter organization name" defaultValue="AssetFlow Corp" />
                  <Input label="Default Currency" placeholder="USD" defaultValue="USD" />
                  <Input label="Time Zone" placeholder="UTC" defaultValue="UTC" />
                  <Input label="Date Format" placeholder="YYYY-MM-DD" defaultValue="YYYY-MM-DD" />
                  <Input label="Fiscal Year Start" placeholder="January" defaultValue="January" />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div variants={itemVariants} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage authentication and security policies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">Two-Factor Authentication</p>
                      <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">Session Timeout</p>
                      <p className="text-xs text-muted-foreground">Auto-logout after inactivity</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                  <Input label="Password Expiry (days)" type="number" defaultValue="90" />
                  <Input label="Max Login Attempts" type="number" defaultValue="5" />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'theme' && (
            <motion.div variants={itemVariants} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize the look and feel</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-3">Theme Mode</p>
                    <div className="flex gap-3">
                      {['Light', 'Dark', 'System'].map((mode) => (
                        <button key={mode} className="flex-1 p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-colors text-center">
                          <Palette className="h-6 w-6 mx-auto mb-2" />
                          <p className="text-sm font-medium">{mode}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-3">Primary Color</p>
                    <div className="flex gap-3">
                      {['#6366f1', '#10b981', '#3b82f6', '#f59e0b', '#dc2626'].map((color) => (
                        <button key={color} className="h-8 w-8 rounded-full border-2 border-transparent hover:border-primary transition-colors" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div variants={itemVariants} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose what notifications you receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    'Asset Assignments', 'Booking Updates', 'Maintenance Requests',
                    'Transfer Approvals', 'Audit Reminders', 'Warranty Expiry',
                    'Overdue Returns', 'System Updates',
                  ].map((item) => (
                    <div key={item} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                      <p className="text-sm font-medium">{item}</p>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'integrations' && (
            <motion.div variants={itemVariants} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Integrations</CardTitle>
                  <CardDescription>Connect with external services</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: 'Slack', desc: 'Receive notifications in Slack', connected: true },
                    { name: 'Microsoft Teams', desc: 'Sync with Teams channels', connected: false },
                    { name: 'Google Workspace', desc: 'Sync users and calendar', connected: false },
                    { name: 'SAP', desc: 'Enterprise resource planning', connected: false },
                  ].map((integration) => (
                    <div key={integration.name} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                      <div>
                        <p className="text-sm font-medium">{integration.name}</p>
                        <p className="text-xs text-muted-foreground">{integration.desc}</p>
                      </div>
                      <Badge variant={integration.connected ? 'success' : 'secondary'} size="sm">
                        {integration.connected ? 'Connected' : 'Not Connected'}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'backup' && (
            <motion.div variants={itemVariants} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Backup & Restore</CardTitle>
                  <CardDescription>Manage system backups</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">Last Backup</p>
                      <p className="text-xs text-muted-foreground">March 19, 2024 at 02:00 AM</p>
                    </div>
                    <Badge variant="success" size="sm">Successful</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">Auto Backup</p>
                      <p className="text-xs text-muted-foreground">Daily at 02:00 AM</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" leftIcon={<RefreshCw className="h-4 w-4" />}>Backup Now</Button>
                    <Button variant="outline" leftIcon={<Database className="h-4 w-4" />}>Restore</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}