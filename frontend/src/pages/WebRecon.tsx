import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { assetsAPI } from '../services/api'
import { Monitor, Search, ExternalLink } from 'lucide-react'

export function WebRecon() {
  const [filter, setFilter] = useState('')
  const { data: urls } = useQuery({
    queryKey: ['urls', filter],
    queryFn: () => assetsAPI.urls({ domain: filter || undefined }).then(r => r.data),
  })

  const statusColor = (code: number | null) => {
    if (!code) return 'bg-secondary text-muted-foreground'
    if (code < 300) return 'bg-green-400/10 text-green-400'
    if (code < 400) return 'bg-yellow-400/10 text-yellow-400'
    return 'bg-red-400/10 text-red-400'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Web Reconnaissance</h2>
          <p className="text-muted-foreground text-sm mt-1">Discovered web services and endpoints</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by domain..."
            className="bg-secondary border border-border rounded-md pl-9 pr-4 py-2 text-sm w-64 font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {urls?.map((u: any) => (
          <div key={u.id} className="bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <span className={`px-2 py-0.5 text-xs rounded font-mono ${statusColor(u.status_code)}`}>
                {u.status_code || 'N/A'}
              </span>
              <a href={u.url} target="_blank" rel="noopener" className="text-muted-foreground hover:text-primary">
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="font-mono text-sm text-foreground truncate mb-1" title={u.url}>
              {u.url}
            </div>
            {u.title && (
              <div className="text-xs text-muted-foreground truncate mb-2">{u.title}</div>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {u.server && (
                <span className="px-1.5 py-0.5 bg-secondary rounded font-mono">{u.server}</span>
              )}
              {u.response_size && (
                <span>{(u.response_size / 1024).toFixed(1)} KB</span>
              )}
            </div>
            {u.technology?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {u.technology.map((t: string) => (
                  <span key={t} className="px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded">{t}</span>
                ))}
              </div>
            )}
          </div>
        ))}
        {(!urls || urls.length === 0) && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No web services discovered yet.
          </div>
        )}
      </div>
    </div>
  )
}
