import { useQuery } from '@tanstack/react-query'
import { scansAPI } from '../services/api'
import { Clock, CheckCircle, XCircle, Loader, Ban } from 'lucide-react'
import { formatDate, statusColor } from '../lib/utils'

export function ScanHistory() {
  const { data: scans, isLoading } = useQuery({
    queryKey: ['scans'],
    queryFn: () => scansAPI.list().then(r => r.data),
  })

  const statusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Loader className="w-4 h-4 text-primary animate-spin" />
      case 'completed': return <CheckCircle className="w-4 h-4 text-success" />
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />
      case 'cancelled': return <Ban className="w-4 h-4 text-muted-foreground" />
      default: return <Clock className="w-4 h-4 text-yellow-400" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Scan History</h2>
        <p className="text-muted-foreground text-sm mt-1">Chronological record of all scan operations</p>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-left">
              <th className="px-4 py-3">Scan ID</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Profile</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Progress</th>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Duration</th>
            </tr>
          </thead>
          <tbody>
            {scans?.map((s: any) => (
              <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/30">
                <td className="px-4 py-3 font-mono text-xs text-primary">{s.scan_id}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 text-xs rounded ${
                    s.scan_type === 'passive' ? 'bg-blue-400/10 text-blue-400' :
                    s.scan_type === 'active' ? 'bg-orange-400/10 text-orange-400' :
                    'bg-purple-400/10 text-purple-400'
                  }`}>
                    {s.scan_type}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{s.profile}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {statusIcon(s.status)}
                    <span className={`text-xs capitalize ${statusColor(s.status)}`}>{s.status}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${s.progress}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{s.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                  {s.current_stage || '-'}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(s.created_at)}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                  {s.started_at && s.completed_at
                    ? `${Math.round((new Date(s.completed_at).getTime() - new Date(s.started_at).getTime()) / 1000)}s`
                    : s.started_at ? 'In progress...' : '-'
                  }
                </td>
              </tr>
            ))}
            {(!scans || scans.length === 0) && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                  No scans executed yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
