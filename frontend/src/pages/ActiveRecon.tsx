import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { targetsAPI, scansAPI } from '../services/api'
import { Radar, ShieldAlert, Play, ShieldCheck } from 'lucide-react'

const PROFILES = [
  { id: 'quick', name: 'Quick Scan', desc: 'Fast discovery with common ports', stages: { passive_recon: true, port_scan: true, web_recon: true } },
  { id: 'standard_pentest', name: 'Standard Pentest', desc: 'Balanced passive + active recon', stages: { passive_recon: true, dns_intelligence: true, subdomain_discovery: true, port_scan: true, service_enum: true, web_recon: true, tech_detection: true, finding_correlation: true } },
  { id: 'deep_recon', name: 'Deep Recon', desc: 'Extensive enumeration', stages: { passive_recon: true, dns_intelligence: true, subdomain_discovery: true, active_recon: true, port_scan: true, service_enum: true, web_recon: true, tech_detection: true, finding_correlation: true } },
  { id: 'passive_only', name: 'Passive Only', desc: 'No direct target interaction', stages: { passive_recon: true, dns_intelligence: true, subdomain_discovery: true } },
]

export function ActiveRecon() {
  const queryClient = useQueryClient()
  const [selectedTarget, setSelectedTarget] = useState('')
  const [selectedProfile, setSelectedProfile] = useState('standard_pentest')
  const [showScopeConfirm, setShowScopeConfirm] = useState(false)
  const [scanType, setScanType] = useState('full')

  const { data: targets } = useQuery({
    queryKey: ['targets'],
    queryFn: () => targetsAPI.list().then(r => r.data),
  })

  const target = targets?.find((t: any) => t.id === selectedTarget)

  const createScan = useMutation({
    mutationFn: () => {
      const profile = PROFILES.find(p => p.id === selectedProfile)
      return scansAPI.create({
        target_id: selectedTarget,
        scan_type: scanType,
        profile: selectedProfile,
        stages_config: profile?.stages || {},
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scans'] })
      setShowScopeConfirm(false)
    },
  })

  const handleStartScan = () => {
    if (target && !target.scope_confirmed) {
      setShowScopeConfirm(true)
    } else {
      createScan.mutate()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Active Reconnaissance</h2>
        <p className="text-muted-foreground text-sm mt-1">Run active scanning against authorized targets</p>
      </div>

      {/* Warning Banner */}
      <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
        <div className="text-sm">
          <p className="font-semibold text-yellow-400">Authorization Required</p>
          <p className="text-muted-foreground mt-1">
            Active scanning interacts directly with targets. Only scan systems you have explicit authorization to test.
            Unauthorized scanning is illegal in most jurisdictions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Target Selection */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-semibold mb-4">Target</h3>
          <select
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
            className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm font-mono mb-3"
          >
            <option value="">Select a target...</option>
            {targets?.map((t: any) => (
              <option key={t.id} value={t.id}>{t.value} ({t.target_type})</option>
            ))}
          </select>
          {target && (
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="capitalize">{target.target_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Scope:</span>
                {target.scope_confirmed ? (
                  <span className="text-success flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Confirmed</span>
                ) : (
                  <span className="text-yellow-400">Not Confirmed</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tags:</span>
                <span>{target.tags?.join(', ') || 'None'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Scan Profile */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-semibold mb-4">Scan Profile</h3>
          <div className="space-y-2">
            {PROFILES.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProfile(p.id)}
                className={`w-full text-left p-3 rounded-md border text-sm transition-colors ${
                  selectedProfile === p.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-border/80 bg-secondary/30'
                }`}
              >
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Scan Type + Launch */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-semibold mb-4">Scan Type</h3>
          <div className="space-y-2 mb-6">
            {['passive', 'active', 'full'].map((type) => (
              <label key={type} className="flex items-center gap-3 p-2 rounded hover:bg-secondary/30 cursor-pointer">
                <input
                  type="radio"
                  name="scanType"
                  value={type}
                  checked={scanType === type}
                  onChange={(e) => setScanType(e.target.value)}
                  className="accent-primary"
                />
                <div>
                  <div className="text-sm capitalize font-medium">{type}</div>
                  <div className="text-xs text-muted-foreground">
                    {type === 'passive' && 'No direct interaction'}
                    {type === 'active' && 'Direct target interaction'}
                    {type === 'full' && 'Complete reconnaissance'}
                  </div>
                </div>
              </label>
            ))}
          </div>
          <button
            onClick={handleStartScan}
            disabled={!selectedTarget || createScan.isPending}
            className="w-full px-4 py-3 bg-primary rounded-md text-primary-foreground text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            {createScan.isPending ? 'Starting...' : 'Launch Scan'}
          </button>
        </div>
      </div>

      {/* Scope Confirmation Modal */}
      {showScopeConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowScopeConfirm(false)}>
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <ShieldAlert className="w-8 h-8 text-yellow-400" />
              <h3 className="text-lg font-semibold">Confirm Authorization</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              You are about to actively scan <span className="font-mono text-foreground">{target?.value}</span>.
              This will send packets directly to the target.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              By proceeding, you confirm that you have <span className="font-semibold text-foreground">explicit written authorization</span> to scan this target.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowScopeConfirm(false)} className="px-4 py-2 text-sm bg-secondary rounded-md">
                Cancel
              </button>
              <button
                onClick={() => createScan.mutate()}
                className="px-4 py-2 text-sm bg-yellow-500 text-black rounded-md font-medium"
              >
                I Have Authorization — Start Scan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
