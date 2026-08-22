import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { osintAPI } from '../services/api'
import { Eye, Search, Globe, Mail, User } from 'lucide-react'

export function OSINT() {
  const [query, setQuery] = useState('')
  const [queryType, setQueryType] = useState('domain')

  const searchMutation = useMutation({
    mutationFn: () => osintAPI.search({ query, query_type: queryType, project_id: '00000000-0000-0000-0000-000000000000' }).then(r => r.data),
  })

  const { data: history } = useQuery({
    queryKey: ['osint-history'],
    queryFn: () => osintAPI.list({}).then(r => r.data),
  })

  const typeIcons: Record<string, any> = { domain: Globe, email: Mail, username: User }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">OSINT</h2>
        <p className="text-muted-foreground text-sm mt-1">Open-source intelligence gathering for authorized investigations</p>
      </div>

      {/* Search Form */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Eye className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold">Intelligence Search</h3>
        </div>
        <div className="flex gap-3">
          <div className="flex gap-1 bg-secondary rounded-md p-1">
            {['domain', 'email', 'username'].map((type) => {
              const Icon = typeIcons[type]
              return (
                <button
                  key={type}
                  onClick={() => setQueryType(type)}
                  className={`px-3 py-1.5 text-xs rounded flex items-center gap-1.5 transition-colors ${
                    queryType === type ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              )
            })}
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                queryType === 'domain' ? 'example.com' :
                queryType === 'email' ? 'user@example.com' : 'username'
              }
              className="w-full bg-secondary border border-border rounded-md pl-9 pr-4 py-2 text-sm font-mono"
              onKeyDown={(e) => e.key === 'Enter' && query && searchMutation.mutate()}
            />
          </div>
          <button
            onClick={() => searchMutation.mutate()}
            disabled={!query || searchMutation.isPending}
            className="px-4 py-2 bg-primary rounded-md text-primary-foreground text-sm disabled:opacity-50"
          >
            Search
          </button>
        </div>
      </div>

      {/* Results */}
      {searchMutation.data && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-semibold mb-4">Search Results</h3>
          <div className="space-y-3">
            {Array.isArray(searchMutation.data) && searchMutation.data.map((result: any) => (
              <div key={result.id} className="p-4 bg-secondary/30 rounded-lg border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm text-foreground">{result.query}</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">{result.source}</span>
                    <span className="text-xs text-muted-foreground">Confidence: {result.confidence}%</span>
                  </div>
                </div>
                <pre className="text-xs text-muted-foreground font-mono bg-background/50 rounded p-3 overflow-auto">
                  {JSON.stringify(result.result_data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-sm font-semibold mb-4">Search History</h3>
        <div className="space-y-2">
          {Array.isArray(history) && history.map((item: any) => (
            <div key={item.id} className="flex items-center gap-3 text-sm py-2 border-b border-border/30">
              <span className={`px-2 py-0.5 text-xs rounded ${
                item.query_type === 'domain' ? 'bg-blue-400/10 text-blue-400' :
                item.query_type === 'email' ? 'bg-purple-400/10 text-purple-400' :
                'bg-green-400/10 text-green-400'
              }`}>
                {item.query_type}
              </span>
              <span className="font-mono">{item.query}</span>
              <span className="text-muted-foreground text-xs ml-auto">{item.source}</span>
            </div>
          ))}
          {(!history || !Array.isArray(history) || history.length === 0) && (
            <p className="text-muted-foreground text-center py-4">No searches yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
