import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { assetsAPI } from '../services/api'
import { Globe, Search, ExternalLink } from 'lucide-react'
import { formatDate } from '../lib/utils'

export function Subdomains() {
  const [filter, setFilter] = useState('')
  const { data: subdomains, isLoading } = useQuery({
    queryKey: ['subdomains', filter],
    queryFn: () => assetsAPI.subdomains({ hostname: filter || undefined }).then(r => r.data),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Subdomain Discovery</h2>
          <p className="text-muted-foreground text-sm mt-1">Unified subdomain database from all sources</p>
        </div>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter subdomains..."
            className="bg-secondary border border-border rounded-md pl-9 pr-4 py-2 text-sm w-64 font-mono"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-left">
              <th className="px-4 py-3">Hostname</th>
              <th className="px-4 py-3">IP Address</th>
              <th className="px-4 py-3">CNAME</th>
              <th className="px-4 py-3">HTTP Status</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Technology</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Alive</th>
            </tr>
          </thead>
          <tbody>
            {subdomains?.map((s: any) => (
              <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/30">
                <td className="px-4 py-3 font-mono text-foreground">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3 h-3 text-muted-foreground" />
                    {s.hostname}
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{s.resolved_ip || '-'}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{s.cname || '-'}</td>
                <td className="px-4 py-3">
                  {s.http_status && (
                    <span className={`px-2 py-0.5 text-xs rounded font-mono ${
                      s.http_status < 300 ? 'bg-green-400/10 text-green-400' :
                      s.http_status < 400 ? 'bg-yellow-400/10 text-yellow-400' :
                      'bg-red-400/10 text-red-400'
                    }`}>
                      {s.http_status}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs max-w-[200px] truncate">{s.title || '-'}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{s.technology || '-'}</td>
                <td className="px-4 py-3 text-xs">
                  <span className="px-2 py-0.5 bg-secondary rounded">{s.source}</span>
                </td>
                <td className="px-4 py-3">
                  {s.is_alive ? (
                    <span className="w-2 h-2 bg-success rounded-full inline-block glow-green" />
                  ) : (
                    <span className="w-2 h-2 bg-muted rounded-full inline-block" />
                  )}
                </td>
              </tr>
            ))}
            {(!subdomains || subdomains.length === 0) && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                  No subdomains discovered yet. Run passive recon or subdomain discovery first.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
