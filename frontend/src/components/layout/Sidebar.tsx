import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Target, Search, Radar, Globe, Network,
  Wifi, Monitor, Cpu, Eye, AlertTriangle, Map, Clock,
  FileText, Settings, Terminal, Shield
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/targets', icon: Target, label: 'Targets' },
  { to: '/passive-recon', icon: Search, label: 'Passive Recon' },
  { to: '/active-recon', icon: Radar, label: 'Active Recon' },
  { to: '/subdomains', icon: Globe, label: 'Subdomains' },
  { to: '/dns', icon: Network, label: 'DNS Intel' },
  { to: '/ports', icon: Wifi, label: 'Port Scanner' },
  { to: '/web-recon', icon: Monitor, label: 'Web Recon' },
  { to: '/technology', icon: Cpu, label: 'Technology' },
  { to: '/osint', icon: Eye, label: 'OSINT' },
  { to: '/findings', icon: AlertTriangle, label: 'Findings' },
  { to: '/attack-surface', icon: Map, label: 'Attack Surface' },
  { to: '/terminal', icon: Terminal, label: 'Live Terminal' },
  { to: '/scan-history', icon: Clock, label: 'Scan History' },
  { to: '/reports', icon: FileText, label: 'Reports' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  return (
    <aside className="w-56 bg-card border-r border-border flex flex-col h-screen">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg font-mono glow-blue">RECON</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Reconnaissance Platform</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary border-r-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground font-mono">
          <span className="text-success glow-green">●</span> System Online
        </div>
      </div>
    </aside>
  )
}
