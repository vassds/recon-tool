import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { assetsAPI } from '../services/api'
import { Network, Search, AlertTriangle } from 'lucide-react'

export function DNSIntelligence() {
  const [recordType, setRecordType] = useState('')
  const { data: records } = useQuery({
    queryKey: ['dns', recordType],
    queryFn: () => assetsAPI.dns({ record_type: recordType || undefined }).then(r => r.data),
  })

  const typeColors: Record<string, string> = {
    A: 'bg-green-400/10 text-green-400',
    AAAA: 'bg-blue-400/10 text-blue-400',
    CNAME: 'bg-cyan-400/10 text-cyan-400',
    MX: 'bg-purple-400/10 text-purple-400',
    NS: 'bg-yellow-400/10 text-yellow-400',
    TXT: 'bg-orange-400/10 text-orange-400',
    SOA: 'bg-red-400/10 text-red-400',
    CAA: 'bg-pink-400/10 text-pink-400',
    SRV: 'bg-indigo-400/10 text-indigo-400',
    PTR: 'bg-teal-400/10 text-teal-400',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">DNS Intelligence</h2>
          <p className="text-muted-foreground text-sm mt-1">DNS record analysis and security assessment</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setRecordType('')}
          className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
            !recordType ? 'bg-primary/10 border-primary text-primary' : 'border-border text-muted-foreground hover:bg-secondary'
          }`}
        >
          All
        </button>
        {['A', 'AAAA', 'CNAME', 'MX', 'NS', 'TXT', 'SOA', 'CAA', 'SRV', 'PTR'].map((t) => (
          <button
            key={t}
            onClick={() => setRecordType(t)}
            className={`px-3 py-1.5 text-xs rounded-md border font-mono transition-colors ${
              recordType === t ? 'bg-primary/10 border-primary text-primary' : 'border-border text-muted-foreground hover:bg-secondary'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* DNS Security Checks */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'SPF Record', status: true, desc: 'Email authentication configured' },
          { label: 'DMARC Record', status: false, desc: 'DMARC policy not found' },
          { label: 'CAA Record', status: false, desc: 'Certificate authority restrictions not set' },
          { label: 'DNSSEC', status: false, desc: 'DNS security extensions not detected' },
        ].map((check) => (
          <div key={check.label} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              {check.status ? (
                <span className="w-2 h-2 bg-success rounded-full glow-green" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
              )}
              <span className="text-sm font-medium">{check.label}</span>
            </div>
            <p className="text-xs text-muted-foreground">{check.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-left">
              <th className="px-4 py-3">Domain</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">TTL</th>
              <th className="px-4 py-3">Source</th>
            </tr>
          </thead>
          <tbody>
            {records?.map((r: any) => (
              <tr key={r.id} className="border-b border-border/50 hover:bg-secondary/30">
                <td className="px-4 py-3 font-mono text-foreground">{r.domain}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 text-xs rounded font-mono ${typeColors[r.record_type] || 'bg-secondary text-muted-foreground'}`}>
                    {r.record_type}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs max-w-[400px] truncate">{r.record_value}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{r.ttl || '-'}</td>
                <td className="px-4 py-3 text-xs">
                  <span className="px-2 py-0.5 bg-secondary rounded">{r.source}</span>
                </td>
              </tr>
            ))}
            {(!records || records.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                  No DNS records found. Run a scan first.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
