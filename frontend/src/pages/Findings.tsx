import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { assetsAPI } from '../services/api'
import { AlertTriangle, Search, Filter, Shield } from 'lucide-react'
import { severityColor, formatDate } from '../lib/utils'

export function Findings() {
  const queryClient = useQueryClient()
  const [severityFilter, setSeverityFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const { data: findings } = useQuery({
    queryKey: ['findings', severityFilter, statusFilter],
    queryFn: () => assetsAPI.findings({
      severity: severityFilter || undefined,
      status: statusFilter || undefined,
    }).then(r => r.data),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => assetsAPI.updateFinding(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['findings'] }),
  })

  const severityCounts = findings?.reduce((acc: any, f: any) => {
    acc[f.severity] = (acc[f.severity] || 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Findings</h2>
        <p className="text-muted-foreground text-sm mt-1">Evidence-based discoveries from reconnaissance</p>
      </div>

      {/* Severity Summary */}
      <div className="grid grid-cols-5 gap-3">
        {['critical', 'high', 'medium', 'low', 'informational'].map((sev) => (
          <button
            key={sev}
            onClick={() => setSeverityFilter(severityFilter === sev ? '' : sev)}
            className={`p-3 rounded-lg border text-center transition-colors ${
              severityFilter === sev ? 'border-primary' : 'border-border'
            } bg-card`}
          >
            <div className={`text-lg font-bold font-mono capitalize ${severityColor(sev).split(' ')[0]}`}>
              {severityCounts?.[sev] || 0}
            </div>
            <div className="text-xs text-muted-foreground capitalize mt-1">{sev}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-secondary border border-border rounded-md px-3 py-2 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="confirmed">Confirmed</option>
          <option value="false_positive">False Positive</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Findings List */}
      <div className="space-y-2">
        {findings?.map((f: any) => (
          <div key={f.id} className="bg-card border border-border rounded-lg overflow-hidden">
            <div
              className="p-4 flex items-center gap-4 cursor-pointer hover:bg-secondary/30"
              onClick={() => setExpandedId(expandedId === f.id ? null : f.id)}
            >
              <span className={`px-2 py-0.5 text-xs rounded font-medium capitalize ${severityColor(f.severity)}`}>
                {f.severity}
              </span>
              <div className="flex-1">
                <div className="font-medium text-sm">{f.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{f.asset || 'N/A'}</div>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="px-2 py-0.5 bg-secondary rounded">{f.status}</span>
                <span>{f.confidence}% confidence</span>
              </div>
            </div>
            {expandedId === f.id && (
              <div className="p-4 border-t border-border bg-secondary/20 space-y-3">
                {f.description && (
                  <div>
                    <span className="text-xs text-muted-foreground">Description:</span>
                    <p className="text-sm mt-1">{f.description}</p>
                  </div>
                )}
                {f.evidence && (
                  <div>
                    <span className="text-xs text-muted-foreground">Evidence:</span>
                    <pre className="text-xs font-mono bg-background rounded p-3 mt-1 overflow-auto">{f.evidence}</pre>
                  </div>
                )}
                {f.detection_method && (
                  <div className="text-xs">
                    <span className="text-muted-foreground">Detection Method:</span>
                    <span className="ml-2">{f.detection_method}</span>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => updateMutation.mutate({ id: f.id, data: { status: 'confirmed' } })}
                    className="px-3 py-1 text-xs bg-success/10 text-success rounded hover:bg-success/20"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => updateMutation.mutate({ id: f.id, data: { status: 'false_positive' } })}
                    className="px-3 py-1 text-xs bg-secondary rounded hover:bg-secondary/80"
                  >
                    False Positive
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {(!findings || findings.length === 0) && (
          <div className="bg-card border border-border rounded-lg p-12 text-center text-muted-foreground">
            No findings yet. Run a scan to generate findings.
          </div>
        )}
      </div>
    </div>
  )
}
