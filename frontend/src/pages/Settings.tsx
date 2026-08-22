import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { settingsAPI } from '../services/api'
import { Settings as SettingsIcon, Key, Shield, Save } from 'lucide-react'

export function Settings() {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsAPI.get().then(r => r.data),
  })

  const [apiKeys, setApiKeys] = useState({
    shodan: '',
    censys: '',
    virustotal: '',
    securitytrails: '',
  })

  const providers = [
    { key: 'shodan', name: 'Shodan', desc: 'Internet-connected device search engine', docs: 'https://developer.shodan.io/' },
    { key: 'censys', name: 'Censys', desc: 'Internet-wide scanning and certificates', docs: 'https://search.censys.io/api' },
    { key: 'virustotal', name: 'VirusTotal', desc: 'URL and domain reputation analysis', docs: 'https://developers.virustotal.com/' },
    { key: 'securitytrails', name: 'SecurityTrails', desc: 'DNS intelligence and historical data', docs: 'https://securitytrails.com/app/account' },
  ]

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground text-sm mt-1">Configure API providers and scanner settings</p>
      </div>

      {/* API Providers */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Key className="w-4 h-4 text-primary" /> API Provider Configuration
        </h3>
        <div className="space-y-4">
          {providers.map((p) => (
            <div key={p.key} className="p-4 bg-secondary/30 rounded-lg border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-medium text-sm">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.desc}</div>
                </div>
                <div className="flex items-center gap-2">
                  {settings?.api_providers?.[p.key]?.configured ? (
                    <span className="px-2 py-0.5 text-xs bg-success/10 text-success rounded">Configured</span>
                  ) : (
                    <span className="px-2 py-0.5 text-xs bg-yellow-400/10 text-yellow-400 rounded">Not Configured</span>
                  )}
                  <a
                    href={p.docs}
                    target="_blank"
                    rel="noopener"
                    className="text-xs text-primary hover:underline"
                  >
                    Get API Key →
                  </a>
                </div>
              </div>
              <input
                value={(apiKeys as any)[p.key]}
                onChange={(e) => setApiKeys({ ...apiKeys, [p.key]: e.target.value })}
                placeholder={`Enter ${p.name} API key...`}
                type="password"
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm font-mono"
              />
            </div>
          ))}
        </div>
        <button className="mt-4 px-4 py-2 bg-primary rounded-md text-primary-foreground text-sm flex items-center gap-2">
          <Save className="w-4 h-4" /> Save API Keys
        </button>
      </div>

      {/* Scanner Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" /> Scanner Settings
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Max Concurrent Scans</label>
            <input
              type="number"
              defaultValue={settings?.scanner_settings?.max_concurrent_scans || 5}
              className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Max Requests/Second</label>
            <input
              type="number"
              defaultValue={settings?.scanner_settings?.max_requests_per_second || 50}
              className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Scan Timeout (seconds)</label>
            <input
              type="number"
              defaultValue={settings?.scanner_settings?.scan_timeout || 300}
              className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Safety */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-yellow-400" /> Safety Controls
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-border/30">
            <span>Require scope confirmation before active scans</span>
            <input type="checkbox" defaultChecked className="accent-primary" />
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border/30">
            <span>Block private IP ranges by default</span>
            <input type="checkbox" defaultChecked className="accent-primary" />
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border/30">
            <span>Log all scan commands</span>
            <input type="checkbox" defaultChecked className="accent-primary" />
          </div>
          <div className="flex items-center justify-between py-2">
            <span>Enable aggressive scanning profiles</span>
            <input type="checkbox" className="accent-primary" />
          </div>
        </div>
      </div>
    </div>
  )
}
