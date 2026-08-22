import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { assetsAPI } from '../services/api'
import { Cpu, Search } from 'lucide-react'

export function Technology() {
  const [filter, setFilter] = useState('')
  const { data: techs } = useQuery({
    queryKey: ['technologies', filter],
    queryFn: () => assetsAPI.technologies({ technology_name: filter || undefined }).then(r => r.data),
  })

  const categoryColors: Record<string, string> = {
    web_server: 'bg-blue-400/10 text-blue-400',
    language: 'bg-yellow-400/10 text-yellow-400',
    framework: 'bg-purple-400/10 text-purple-400',
    cms: 'bg-green-400/10 text-green-400',
    cdn: 'bg-cyan-400/10 text-cyan-400',
    database: 'bg-orange-400/10 text-orange-400',
  }

  // Group by host
  const grouped = techs?.reduce((acc: any, t: any) => {
    if (!acc[t.host]) acc[t.host] = []
    acc[t.host].push(t)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Technology Detection</h2>
          <p className="text-muted-foreground text-sm mt-1">Identified technologies across discovered assets</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter technologies..."
            className="bg-secondary border border-border rounded-md pl-9 pr-4 py-2 text-sm w-64 font-mono"
          />
        </div>
      </div>

      {/* Technology summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Web Servers', count: techs?.filter((t: any) => ['Nginx', 'Apache', 'IIS', 'Caddy'].includes(t.technology_name)).length || 0 },
          { label: 'Languages', count: techs?.filter((t: any) => ['PHP', 'Python', 'Node.js', 'Java', 'Ruby'].includes(t.technology_name)).length || 0 },
          { label: 'Frameworks', count: techs?.filter((t: any) => ['React', 'Laravel', 'Django', 'Spring', 'Express'].includes(t.technology_name)).length || 0 },
          { label: 'CMS', count: techs?.filter((t: any) => ['WordPress', 'Drupal', 'Joomla'].includes(t.technology_name)).length || 0 },
        ].map((card) => (
          <div key={card.label} className="bg-card border border-border rounded-lg p-4">
            <div className="text-2xl font-bold font-mono">{card.count}</div>
            <div className="text-xs text-muted-foreground mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {grouped && Object.entries(grouped).map(([host, technologies]: [string, any]) => (
        <div key={host} className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-semibold font-mono mb-4">{host}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground text-left text-xs">
                  <th className="pb-2">Technology</th>
                  <th className="pb-2">Version</th>
                  <th className="pb-2">Category</th>
                  <th className="pb-2">Confidence</th>
                  <th className="pb-2">Evidence</th>
                </tr>
              </thead>
              <tbody>
                {technologies.map((t: any) => (
                  <tr key={t.id} className="border-t border-border/30">
                    <td className="py-2 font-medium">{t.technology_name}</td>
                    <td className="py-2 font-mono text-xs text-muted-foreground">{t.version || '-'}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 text-xs rounded ${categoryColors[t.category] || 'bg-secondary text-muted-foreground'}`}>
                        {t.category || 'unknown'}
                      </span>
                    </td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${t.confidence}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{t.confidence}%</span>
                      </div>
                    </td>
                    <td className="py-2 text-xs text-muted-foreground max-w-[300px] truncate">{t.evidence || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {(!techs || techs.length === 0) && (
        <div className="bg-card border border-border rounded-lg p-12 text-center text-muted-foreground">
          No technologies detected yet.
        </div>
      )}
    </div>
  )
}
