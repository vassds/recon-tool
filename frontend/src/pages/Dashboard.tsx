import { useQuery } from '@tanstack/react-query'
import { assetsAPI, scansAPI } from '../services/api'
import { Shield, Globe, Wifi, Monitor, Cpu, AlertTriangle, Target, Activity } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

const severityColors = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#6b7280']

export function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => assetsAPI.stats().then(r => r.data),
  })
  const { data: scans } = useQuery({
    queryKey: ['scanStats'],
    queryFn: () => scansAPI.stats().then(r => r.data),
  })

  const statCards = [
    { label: 'Subdomains', value: stats?.subdomains || 0, icon: Globe, color: 'text-primary' },
    { label: 'IP Addresses', value: stats?.ip_addresses || 0, icon: Target, color: 'text-blue-400' },
    { label: 'Open Ports', value: stats?.open_ports || 0, icon: Wifi, color: 'text-green-400' },
    { label: 'Services', value: stats?.services || 0, icon: Monitor, color: 'text-cyan-400' },
    { label: 'Technologies', value: stats?.technologies || 0, icon: Cpu, color: 'text-purple-400' },
    { label: 'Findings', value: stats?.findings || 0, icon: AlertTriangle, color: 'text-orange-400' },
  ]

  const severityData = stats?.findings_by_severity
    ? Object.entries(stats.findings_by_severity).map(([name, value]) => ({ name, value: value as number }))
    : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reconnaissance Dashboard</h2>
          <p className="text-muted-foreground text-sm mt-1">Overview of all discovered assets and findings</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Activity className="w-4 h-4 text-success glow-green" />
          <span>{scans?.running || 0} active scans</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <card.icon className={`w-5 h-5 ${card.color}`} />
              <span className="text-xs text-muted-foreground">{card.label}</span>
            </div>
            <div className="text-2xl font-bold font-mono">{card.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Severity Distribution */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Finding Severity Distribution
          </h3>
          {severityData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={severityData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                    {severityData.map((_, i) => (
                      <Cell key={i} fill={severityColors[i % severityColors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {severityData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: severityColors[i] }} />
                    <span className="capitalize text-muted-foreground">{item.name}</span>
                    <span className="font-mono ml-auto">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">No findings yet</div>
          )}
        </div>

        {/* Scan Activity */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Scan Activity
          </h3>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-4 bg-secondary/30 rounded-lg">
              <div className="text-2xl font-bold font-mono text-primary">{scans?.running || 0}</div>
              <div className="text-xs text-muted-foreground mt-1">Running</div>
            </div>
            <div className="text-center p-4 bg-secondary/30 rounded-lg">
              <div className="text-2xl font-bold font-mono text-success glow-green">{scans?.completed || 0}</div>
              <div className="text-xs text-muted-foreground mt-1">Completed</div>
            </div>
            <div className="text-center p-4 bg-secondary/30 rounded-lg">
              <div className="text-2xl font-bold font-mono text-red-400 glow-red">{scans?.failed || 0}</div>
              <div className="text-xs text-muted-foreground mt-1">Failed</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-secondary/20 rounded text-xs font-mono text-muted-foreground">
            Total scans executed: {scans?.total_scans || 0}
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-sm font-semibold mb-4">System Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success glow-green" />
            <span className="text-muted-foreground">Backend API</span>
            <span className="text-success ml-auto">Online</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success glow-green" />
            <span className="text-muted-foreground">Task Queue</span>
            <span className="text-success ml-auto">Online</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success glow-green" />
            <span className="text-muted-foreground">Database</span>
            <span className="text-success ml-auto">Connected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success glow-green" />
            <span className="text-muted-foreground">WebSocket</span>
            <span className="text-success ml-auto">Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}
