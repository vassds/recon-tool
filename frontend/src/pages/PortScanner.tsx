import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { assetsAPI } from '../services/api'
import { Wifi, Search } from 'lucide-react'

export function PortScanner() {
  const [hostFilter, setHostFilter] = useState('')
  const { data: ports } = useQuery({
    queryKey: ['ports', hostFilter],
    queryFn: () => assetsAPI.ports({ host: hostFilter || undefined }).then(r => r.data),
  })

  const stateColor = (state: string) => {
    switch (state) {
      case 'open': return 'bg-success/10 text-success'
      case 'filtered': return 'bg-yellow-400/10 text-yellow-400'
      case 'closed': return 'bg-red-400/10 text-red-400'
      default: return 'bg-secondary text-muted-foreground'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Port Scanner</h2>
          <p className="text-muted-foreground text-sm mt-1">Discovered ports and services</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={hostFilter}
            onChange={(e) => setHostFilter(e.target.value)}
            placeholder="Filter by host..."
            className="bg-secondary border border-border rounded-md pl-9 pr-4 py-2 text-sm w-64 font-mono"
          />
        </div>
      </div>

      {/* Port visualization */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-sm font-semibold mb-4">Port Distribution</h3>
        <div className="grid grid-cols-10 gap-1">
          {Array.from({ length: 100 }, (_, i) => {
            const portNum = (i + 1) * 65
            const hasPort = ports?.some((p: any) => Math.abs(p.port_number - portNum) < 65)
            return (
              <div
                key={i}
                className={`h-3 rounded-sm ${hasPort ? 'bg-success' : 'bg-secondary/50'}`}
                title={`${portNum}: ${hasPort ? 'open' : 'closed'}`}
              />
            )
          })}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2 font-mono">
          <span>0</span>
          <span>6553</span>
          <span>13106</span>
          <span>19659</span>
          <span>26212</span>
          <span>32765</span>
          <span>39318</span>
          <span>45871</span>
          <span>52424</span>
          <span>58977</span>
          <span>65535</span>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-left">
              <th className="px-4 py-3">Host</th>
              <th className="px-4 py-3">Port</th>
              <th className="px-4 py-3">Protocol</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Version</th>
              <th className="px-4 py-3">Source</th>
            </tr>
          </thead>
          <tbody>
            {ports?.map((p: any) => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/30">
                <td className="px-4 py-3 font-mono text-foreground">{p.host}</td>
                <td className="px-4 py-3 font-mono">
                  <span className="text-primary font-bold">{p.port_number}</span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.protocol}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 text-xs rounded ${stateColor(p.state)}`}>
                    {p.state.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-foreground">{p.service_name || '-'}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{p.version || '-'}</td>
                <td className="px-4 py-3 text-xs">
                  <span className="px-2 py-0.5 bg-secondary rounded">{p.source}</span>
                </td>
              </tr>
            ))}
            {(!ports || ports.length === 0) && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  No ports discovered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
