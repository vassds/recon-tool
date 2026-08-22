import { useLocation } from 'react-router-dom'
import { Bell, Search } from 'lucide-react'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/targets': 'Target Management',
  '/passive-recon': 'Passive Reconnaissance',
  '/active-recon': 'Active Reconnaissance',
  '/subdomains': 'Subdomain Discovery',
  '/dns': 'DNS Intelligence',
  '/ports': 'Port Scanner',
  '/web-recon': 'Web Reconnaissance',
  '/technology': 'Technology Detection',
  '/osint': 'OSINT',
  '/findings': 'Findings',
  '/attack-surface': 'Attack Surface Map',
  '/terminal': 'Live Terminal',
  '/scan-history': 'Scan History',
  '/reports': 'Reports',
  '/settings': 'Settings',
}

export function Header() {
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'Recon Platform'

  return (
    <header className="h-14 border-b border-border bg-card/50 backdrop-blur flex items-center justify-between px-6">
      <div>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search assets..."
            className="bg-secondary border border-border rounded-md pl-9 pr-4 py-1.5 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button className="relative p-2 hover:bg-secondary rounded-md">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
            A
          </div>
        </div>
      </div>
    </header>
  )
}
