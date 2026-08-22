import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reportsAPI, projectsAPI } from '../services/api'
import { FileText, Download, Plus, Loader } from 'lucide-react'
import { formatDate } from '../lib/utils'

export function Reports() {
  const queryClient = useQueryClient()
  const [showCreate, setShowCreate] = useState(false)
  const [title, setTitle] = useState('')
  const [format, setFormat] = useState('html')
  const [selectedProject, setSelectedProject] = useState('')

  const { data: reports } = useQuery({
    queryKey: ['reports'],
    queryFn: () => reportsAPI.list().then(r => r.data),
  })

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsAPI.list().then(r => r.data),
  })

  const createMutation = useMutation({
    mutationFn: () => reportsAPI.create({
      project_id: selectedProject || projects?.[0]?.id,
      title,
      format,
      scan_ids: [],
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      setShowCreate(false)
      setTitle('')
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reports</h2>
          <p className="text-muted-foreground text-sm mt-1">Generate professional reconnaissance reports</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-3 py-2 text-sm bg-primary rounded-md text-primary-foreground flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Generate Report
        </button>
      </div>

      {/* Create Report Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowCreate(false)}>
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Generate Report</h3>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Report title"
              className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm mb-3"
              autoFocus
            />
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm mb-3"
            >
              <option value="">Select project...</option>
              {projects?.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {['html', 'pdf', 'json', 'csv', 'markdown'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`px-2 py-2 text-xs rounded border ${
                    format === f ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm bg-secondary rounded-md">Cancel</button>
              <button
                onClick={() => createMutation.mutate()}
                disabled={!title || createMutation.isPending}
                className="px-4 py-2 text-sm bg-primary rounded-md text-primary-foreground disabled:opacity-50"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports?.map((r: any) => (
          <div key={r.id} className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <span className="font-medium text-sm">{r.title}</span>
              </div>
              <span className="px-2 py-0.5 text-xs bg-secondary rounded font-mono">{r.format.toUpperCase()}</span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1 mb-4">
              <div>Created: {formatDate(r.created_at)}</div>
              <div>Status: <span className={r.status === 'completed' ? 'text-success' : 'text-yellow-400'}>{r.status}</span></div>
              {r.file_size && <div>Size: {(r.file_size / 1024).toFixed(1)} KB</div>}
            </div>
            {r.status === 'completed' && (
              <a
                href={reportsAPI.download(r.id)}
                className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded text-sm hover:bg-primary/20"
              >
                <Download className="w-4 h-4" /> Download
              </a>
            )}
          </div>
        ))}
        {(!reports || reports.length === 0) && (
          <div className="col-span-full text-center py-12 text-muted-foreground bg-card border border-border rounded-lg">
            No reports generated yet.
          </div>
        )}
      </div>
    </div>
  )
}
