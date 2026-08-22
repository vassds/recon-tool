import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { targetsAPI, projectsAPI } from '../services/api'
import { Plus, Trash2, ShieldCheck, ShieldAlert, Search, Globe, MapPin, Mail, User } from 'lucide-react'
import { formatDate, statusColor } from '../lib/utils'

export function Targets() {
  const queryClient = useQueryClient()
  const [showAdd, setShowAdd] = useState(false)
  const [newValue, setNewValue] = useState('')
  const [newTags, setNewTags] = useState('')
  const [bulkMode, setBulkMode] = useState(false)
  const [bulkText, setBulkText] = useState('')
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [filter, setFilter] = useState('')

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsAPI.list().then(r => r.data),
  })

  const { data: targets } = useQuery({
    queryKey: ['targets', selectedProject],
    queryFn: () => targetsAPI.list(selectedProject || undefined).then(r => r.data),
  })

  const addMutation = useMutation({
    mutationFn: () => {
      const projectId = selectedProject || projects?.[0]?.id
      return targetsAPI.create({ value: newValue, target_type: 'auto', tags: newTags.split(',').filter(Boolean) }, projectId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targets'] })
      setNewValue('')
      setNewTags('')
      setShowAdd(false)
    },
  })

  const bulkMutation = useMutation({
    mutationFn: () => {
      const projectId = selectedProject || projects?.[0]?.id
      const lines = bulkText.split('\n').filter(l => l.trim())
      return targetsAPI.bulkCreate({ targets: lines, project_id: projectId })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targets'] })
      setBulkText('')
      setBulkMode(false)
    },
  })

  const scopeMutation = useMutation({
    mutationFn: (id: string) => targetsAPI.confirmScope(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['targets'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => targetsAPI.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['targets'] }),
  })

  const typeIcon = (type: string) => {
    const icons: Record<string, any> = { domain: Globe, ip: MapPin, cidr: MapPin, url: Globe, email: Mail, username: User }
    const Icon = icons[type] || Globe
    return <Icon className="w-4 h-4" />
  }

  const filtered = targets?.filter((t: any) =>
    !filter || t.value.toLowerCase().includes(filter.toLowerCase()) || t.target_type.includes(filter)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Target Management</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage recon targets with scope controls</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setBulkMode(!bulkMode)} className="px-3 py-2 text-sm bg-secondary rounded-md hover:bg-secondary/80">
            Bulk Import
          </button>
          <button onClick={() => setShowAdd(true)} className="px-3 py-2 text-sm bg-primary rounded-md text-primary-foreground hover:bg-primary/90 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Target
          </button>
        </div>
      </div>

      {/* Project Filter */}
      <div className="flex gap-4 items-center">
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="bg-secondary border border-border rounded-md px-3 py-2 text-sm"
        >
          <option value="">All Projects</option>
          {projects?.map((p: any) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter targets..."
            className="w-full bg-secondary border border-border rounded-md pl-9 pr-4 py-2 text-sm"
          />
        </div>
      </div>

      {/* Add Target Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowAdd(false)}>
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Add Target</h3>
            <input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="example.com, 10.0.0.0/24, https://..."
              className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm mb-3 font-mono"
              autoFocus
            />
            <input
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              placeholder="Tags (comma-separated)"
              className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm mb-4"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm bg-secondary rounded-md">Cancel</button>
              <button
                onClick={() => addMutation.mutate()}
                disabled={!newValue}
                className="px-4 py-2 text-sm bg-primary rounded-md text-primary-foreground disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {bulkMode && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Bulk Import Targets</h3>
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder={"example.com\n192.168.1.0/24\nhttps://target.com\nuser@email.com"}
            className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm font-mono h-32 mb-4"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setBulkMode(false)} className="px-4 py-2 text-sm bg-secondary rounded-md">Cancel</button>
            <button
              onClick={() => bulkMutation.mutate()}
              disabled={!bulkText.trim()}
              className="px-4 py-2 text-sm bg-primary rounded-md text-primary-foreground disabled:opacity-50"
            >
              Import ({bulkText.split('\n').filter(l => l.trim()).length} targets)
            </button>
          </div>
        </div>
      )}

      {/* Target List */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-left">
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Target</th>
              <th className="px-4 py-3">Tags</th>
              <th className="px-4 py-3">Scope</th>
              <th className="px-4 py-3">Profile</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered?.map((t: any) => (
              <tr key={t.id} className="border-b border-border/50 hover:bg-secondary/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {typeIcon(t.target_type)}
                    <span className="capitalize">{t.target_type}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-foreground">{t.value}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {t.tags?.map((tag: string) => (
                      <span key={tag} className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">{tag}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {t.scope_confirmed ? (
                    <span className="flex items-center gap-1 text-success text-xs">
                      <ShieldCheck className="w-4 h-4" /> Confirmed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-yellow-400 text-xs">
                      <ShieldAlert className="w-4 h-4" /> Pending
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{t.scan_profile}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(t.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {!t.scope_confirmed && (
                      <button
                        onClick={() => scopeMutation.mutate(t.id)}
                        className="px-2 py-1 text-xs bg-success/10 text-success rounded hover:bg-success/20"
                      >
                        Confirm Scope
                      </button>
                    )}
                    <button
                      onClick={() => deleteMutation.mutate(t.id)}
                      className="p-1 text-red-400 hover:bg-red-400/10 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {(!filtered || filtered.length === 0) && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  No targets found. Add a target to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
