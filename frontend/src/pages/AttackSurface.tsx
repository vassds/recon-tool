import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { assetsAPI } from '../services/api'
import { Map as MapIcon, Globe, Wifi, Monitor, AlertTriangle, Search, ZoomIn, ZoomOut } from 'lucide-react'

interface TreeNode {
  id: string
  label: string
  type: 'domain' | 'subdomain' | 'ip' | 'port' | 'service' | 'tech'
  children?: TreeNode[]
  color: string
}

export function AttackSurface() {
  const [search, setSearch] = useState('')
  const [zoom, setZoom] = useState(1)

  const { data: subdomains } = useQuery({
    queryKey: ['subdomains'],
    queryFn: () => assetsAPI.subdomains({}).then(r => r.data),
  })
  const { data: ports } = useQuery({
    queryKey: ['ports'],
    queryFn: () => assetsAPI.ports({}).then(r => r.data),
  })
  const { data: techs } = useQuery({
    queryKey: ['technologies'],
    queryFn: () => assetsAPI.technologies({}).then(r => r.data),
  })

  // Build tree structure
  const buildTree = (): TreeNode[] => {
    const domainMap = new Map<string, TreeNode>()
    const _ipMap = new Map<string, TreeNode>()

    subdomains?.forEach((s: any) => {
      const domain = s.hostname.split('.').slice(-2).join('.')
      if (!domainMap.has(domain)) {
        domainMap.set(domain, {
          id: domain, label: domain, type: 'domain', color: '#8b5cf6', children: [],
        })
      }
      const subNode: TreeNode = {
        id: s.hostname, label: s.hostname, type: 'subdomain', color: '#3b82f6', children: [],
      }
      if (s.resolved_ip) {
        const ipKey = `${s.hostname}:${s.resolved_ip}`
        const ipNode: TreeNode = {
          id: ipKey, label: s.resolved_ip, type: 'ip', color: '#10b981', children: [],
        }
        ports?.filter((p: any) => p.host === s.resolved_ip).forEach((p: any) => {
          ipNode.children!.push({
            id: `${p.host}:${p.port_number}`, label: `${p.port_number}/${p.protocol} ${p.service_name || ''}`, type: 'port',
            color: '#f59e0b',
          })
        })
        subNode.children!.push(ipNode)
      }
      techs?.filter((t: any) => t.host === s.hostname).forEach((t: any) => {
        subNode.children!.push({
          id: `${t.host}:${t.technology_name}`, label: `${t.technology_name}${t.version ? ` ${t.version}` : ''}`, type: 'tech',
          color: '#ec4899',
        })
      })
      domainMap.get(domain)!.children!.push(subNode)
    })

    return Array.from(domainMap.values())
  }

  const tree = buildTree()

  const typeIcon = (type: string) => {
    const icons: Record<string, any> = { domain: Globe, subdomain: Globe, ip: Wifi, port: Wifi, service: Monitor, tech: AlertTriangle }
    const Icon = icons[type] || Globe
    return <Icon className="w-3.5 h-3.5" />
  }

  const filterTree = (nodes: TreeNode[], term: string): TreeNode[] => {
    if (!term) return nodes
    return nodes.map(n => ({
      ...n,
      children: filterTree(n.children || [], term),
    })).filter(n => n.label.toLowerCase().includes(term.toLowerCase()) || (n.children && n.children.length > 0))
  }

  const filteredTree = filterTree(tree, search)

  const renderNode = (node: TreeNode, depth: number = 0) => {
    const hasChildren = node.children && node.children.length > 0
    return (
      <div key={node.id}>
        <div
          className="flex items-center gap-2 py-1.5 px-2 hover:bg-secondary/30 rounded cursor-pointer text-sm"
          style={{ paddingLeft: `${depth * 24 + 8}px` }}
        >
          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: node.color }} />
          {typeIcon(node.type)}
          <span className="font-mono text-foreground truncate">{node.label}</span>
          <span className="text-xs text-muted-foreground ml-auto capitalize">{node.type}</span>
          {hasChildren && (
            <span className="text-xs text-muted-foreground bg-secondary rounded px-1.5 py-0.5">
              {node.children!.length}
            </span>
          )}
        </div>
        {hasChildren && (
          <div>
            {node.children!.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Attack Surface Map</h2>
          <p className="text-muted-foreground text-sm mt-1">Interactive visualization of discovered assets</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets..."
              className="bg-secondary border border-border rounded-md pl-9 pr-4 py-2 text-sm w-48 font-mono"
            />
          </div>
          <button onClick={() => setZoom(z => Math.min(z + 0.1, 2))} className="p-2 bg-secondary rounded-md hover:bg-secondary/80">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))} className="p-2 bg-secondary rounded-md hover:bg-secondary/80">
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-muted-foreground">
        {[
          { color: '#8b5cf6', label: 'Domain' },
          { color: '#3b82f6', label: 'Subdomain' },
          { color: '#10b981', label: 'IP Address' },
          { color: '#f59e0b', label: 'Port' },
          { color: '#ec4899', label: 'Technology' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
            {l.label}
          </div>
        ))}
      </div>

      {/* Attack Surface Tree */}
      <div className="bg-card border border-border rounded-lg p-4 overflow-auto max-h-[calc(100vh-250px)]" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
        {filteredTree.length > 0 ? (
          filteredTree.map(node => renderNode(node))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <MapIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No assets discovered yet. Run a scan to populate the attack surface.</p>
          </div>
        )}
      </div>
    </div>
  )
}
