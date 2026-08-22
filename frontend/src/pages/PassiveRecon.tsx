import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Search, Globe, FileText, Lock } from 'lucide-react'

export function PassiveRecon() {
  const [target, setTarget] = useState('')
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runPassive = useMutation({
    mutationFn: async () => {
      // Simulate passive recon - in production, this calls the backend
      setLoading(true)
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            whois: {
              domain: target,
              registrar: 'Example Registrar Inc.',
              name_servers: ['ns1.example.com', 'ns2.example.com'],
              creation_date: '2010-03-15',
              expiration_date: '2025-03-15',
              status: ['clientTransferProhibited'],
              emails: ['admin@example.com'],
              org: 'Example Organization',
              country: 'US',
            },
            dns: [
              { type: 'A', value: '93.184.216.34', ttl: 3600 },
              { type: 'AAAA', value: '2606:2800:220:1:248:1893:25c8:1946', ttl: 3600 },
              { type: 'MX', value: 'mail.example.com', ttl: 3600, priority: 10 },
              { type: 'NS', value: 'ns1.example.com', ttl: 86400 },
              { type: 'TXT', value: 'v=spf1 include:_spf.example.com ~all', ttl: 3600 },
              { type: 'SOA', value: 'ns1.example.com admin.example.com 2024010101 3600 900 604800 86400', ttl: 86400 },
            ],
            certificates: [
              { common_name: '*.example.com', issuer: "Let's Encrypt Authority X3", valid_from: '2024-01-01', valid_to: '2024-04-01', names: ['example.com', '*.example.com'] },
            ],
          })
          setLoading(false)
        }, 1500)
      })
    },
    onSuccess: (data) => setResults(data),
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Passive Reconnaissance</h2>
        <p className="text-muted-foreground text-sm mt-1">Gather intelligence without direct interaction with the target</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Target domain (e.g., example.com)"
            className="w-full bg-secondary border border-border rounded-md pl-9 pr-4 py-2 text-sm font-mono"
            onKeyDown={(e) => e.key === 'Enter' && target && runPassive.mutate()}
          />
        </div>
        <button
          onClick={() => runPassive.mutate()}
          disabled={!target || loading}
          className="px-4 py-2 bg-primary rounded-md text-primary-foreground text-sm disabled:opacity-50 flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          {loading ? 'Running...' : 'Start Passive Recon'}
        </button>
      </div>

      {results && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* WHOIS */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" /> WHOIS Information
            </h3>
            <div className="space-y-2 text-sm">
              {Object.entries(results.whois).filter(([k]) => k !== 'domain').map(([key, val]) => (
                <div key={key} className="flex">
                  <span className="text-muted-foreground w-32 capitalize">{key.replace(/_/g, ' ')}:</span>
                  <span className="font-mono text-foreground">
                    {Array.isArray(val) ? val.join(', ') : String(val || 'N/A')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* DNS */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" /> DNS Records
            </h3>
            <div className="space-y-1">
              {results.dns.map((r: any, i: number) => (
                <div key={i} className="flex items-center gap-2 text-sm py-1 border-b border-border/30">
                  <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded font-mono w-12 text-center">
                    {r.type}
                  </span>
                  <span className="font-mono text-foreground flex-1 truncate">{r.value}</span>
                  {r.ttl && <span className="text-muted-foreground text-xs">TTL: {r.ttl}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Certificates */}
          <div className="bg-card border border-border rounded-lg p-6 lg:col-span-2">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" /> Certificate Transparency
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground text-left text-xs">
                    <th className="pb-2">Common Name</th>
                    <th className="pb-2">Issuer</th>
                    <th className="pb-2">Valid From</th>
                    <th className="pb-2">Valid To</th>
                    <th className="pb-2">DNS Names</th>
                  </tr>
                </thead>
                <tbody>
                  {results.certificates.map((cert: any, i: number) => (
                    <tr key={i} className="border-t border-border/30">
                      <td className="py-2 font-mono">{cert.common_name}</td>
                      <td className="py-2 text-muted-foreground">{cert.issuer}</td>
                      <td className="py-2 font-mono text-xs">{cert.valid_from}</td>
                      <td className="py-2 font-mono text-xs">{cert.valid_to}</td>
                      <td className="py-2">
                        <div className="flex flex-wrap gap-1">
                          {cert.names.map((n: string) => (
                            <span key={n} className="px-1.5 py-0.5 text-xs bg-secondary rounded font-mono">{n}</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
