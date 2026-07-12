import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Download,
  FileText,
  FileSpreadsheet,
  File as FilePdf,
  Clock,
  RefreshCw,
  Calendar,
  TrendingUp,
  PieChart,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const reports = [
  { id: '1', name: 'Asset Utilization Report', type: 'asset_utilization', format: 'pdf', generated: '2024-03-19', status: 'ready' },
  { id: '2', name: 'Department Allocation Summary', type: 'department_utilization', format: 'excel', generated: '2024-03-18', status: 'ready' },
  { id: '3', name: 'Maintenance Cost Analysis', type: 'maintenance_cost', format: 'pdf', generated: '2024-03-17', status: 'ready' },
  { id: '4', name: 'Monthly Booking Heatmap', type: 'booking_heatmap', format: 'csv', generated: '2024-03-15', status: 'ready' },
];

const reportTemplates = [
  { icon: TrendingUp, name: 'Asset Utilization', desc: 'Track asset usage across departments', color: 'from-primary to-accent' },
  { icon: PieChart, name: 'Department Overview', desc: 'Department-wise asset distribution', color: 'from-secondary to-emerald-500' },
  { icon: Activity, name: 'Maintenance Trends', desc: 'Analysis of maintenance requests', color: 'from-amber-500 to-orange-500' },
  { icon: BarChart3, name: 'Audit Performance', desc: 'Audit completion and discrepancies', color: 'from-rose-500 to-red-500' },
  { icon: Calendar, name: 'Booking Analytics', desc: 'Resource booking patterns and trends', color: 'from-accent to-blue-500' },
  { icon: RefreshCw, name: 'Lifecycle Report', desc: 'Asset lifecycle stage analysis', color: 'from-purple-500 to-pink-500' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function ReportsPage() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-1">Generate and download analytical reports</p>
        </div>
        <Button leftIcon={<FileText className="h-4 w-4" />}>Generate Report</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Reports Generated', value: '48', icon: FileText, color: 'from-primary to-accent' },
          { label: 'This Month', value: '12', icon: Clock, color: 'from-accent to-blue-500' },
          { label: 'Scheduled', value: '5', icon: RefreshCw, color: 'from-secondary to-emerald-500' },
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

      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Reports</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTemplates.map((template) => (
            <motion.div key={template.name} variants={itemVariants}>
              <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                <CardContent className="p-5">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${template.color} mb-3`}>
                    <template.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{template.desc}</p>
                  <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="outline" size="sm" className="flex-1" leftIcon={<Download className="h-3.5 w-3.5" />}>Generate</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
          <CardDescription>Recently generated reports available for download</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 text-left">
                  <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Report Name</th>
                  <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Format</th>
                  <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Generated</th>
                  <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-b border-border/50 hover:bg-accent/5 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{report.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="default" size="sm">{report.format.toUpperCase()}</Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{report.generated}</td>
                    <td className="py-3 px-4">
                      <Badge variant="success" size="sm">{report.status}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>Download</Button>
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