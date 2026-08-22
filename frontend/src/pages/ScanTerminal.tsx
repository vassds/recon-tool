import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { scansAPI } from '../services/api'
import { Terminal, Pause, Play, X, Trash2, Download } from 'lucide-react'

interface LogEntry {
  timestamp: string
  level: string
  stage: string
  message: string
}

const DEMO_LOGS: LogEntry[] = [
  { timestamp: '10:21:03', level: 'INFO', stage: 'pipeline', message: 'Starting reconnaissance...' },
  { timestamp: '10:21:04', level: 'INFO', stage: 'passive_recon', message: 'Performing WHOIS lookup on target...' },
  { timestamp: '10:21:05', level: 'INFO', stage: 'passive_recon', message: 'WHOIS: Registrar found - Example Registrar Inc.' },
  { timestamp: '10:21:06', level: 'INFO', stage: 'dns_intelligence', message: 'Enumerating DNS records...' },
  { timestamp: '10:21:07', level: 'INFO', stage: 'dns_intelligence', message: 'Found 14 DNS records (A: 2, AAAA: 1, MX: 3, NS: 2, TXT: 4, SOA: 1, CAA: 1)' },
  { timestamp: '10:21:08', level: 'INFO', stage: 'subdomain_discovery', message: 'Starting passive subdomain enumeration...' },
  { timestamp: '10:21:10', level: 'INFO', stage: 'subdomain_discovery', message: 'Certificate transparency: found 23 subdomains' },
  { timestamp: '10:21:11', level: 'INFO', stage: 'subdomain_discovery', message: 'Shodan DNS: found 8 additional subdomains' },
  { timestamp: '10:21:12', level: 'INFO', stage: 'subdomain_discovery', message: 'Total unique subdomains: 31' },
  { timestamp: '10:21:13', level: 'INFO', stage: 'port_scan', message: 'Starting TCP port scan...' },
  { timestamp: '10:21:15', level: 'INFO', stage: 'port_scan', message: 'Scanning top 1000 ports...' },
  { timestamp: '10:21:20', level: 'INFO', stage: 'port_scan', message: 'Found 6 open ports: 22/tcp, 80/tcp, 443/tcp, 3306/tcp, 8080/tcp, 8443/tcp' },
  { timestamp: '10:21:21', level: 'INFO', stage: 'web_recon', message: 'Probing HTTP services...' },
  { timestamp: '10:21:22', level: 'INFO', stage: 'web_recon', message: 'HTTP 200: https://example.com - Title: Example Domain' },
  { timestamp: '10:21:23', level: 'INFO', stage: 'web_recon', message: 'HTTP 200: http://www.example.com - Redirects to HTTPS' },
  { timestamp: '10:21:24', level: 'WARNING', stage: 'web_recon', message: 'HTTP 503: http://dev.example.com - Service temporarily unavailable' },
  { timestamp: '10:21:25', level: 'INFO', stage: 'tech_detection', message: 'Detecting technologies...' },
  { timestamp: '10:21:26', level: 'INFO', stage: 'tech_detection', message: 'Detected: nginx/1.24.0 (confidence: 95%)' },
  { timestamp: '10:21:26', level: 'INFO', stage: 'tech_detection', message: 'Detected: PHP 8.2 (confidence: 80%)' },
  { timestamp: '10:21:27', level: 'INFO', stage: 'tech_detection', message: 'Detected: Let\'s Encrypt SSL (confidence: 100%)' },
  { timestamp: '10:21:28', level: 'INFO', stage: 'finding_correlation', message: 'Correlating findings...' },
  { timestamp: '10:21:29', level: 'INFO', stage: 'finding_correlation', message: 'Generated 3 informational findings, 1 low severity' },
  { timestamp: '10:21:30', level: 'INFO', stage: 'pipeline', message: 'Scan completed successfully. Duration: 27s' },
]

export function ScanTerminal() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [logIndex, setLogIndex] = useState(0)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Simulate log streaming
  useEffect(() => {
    if (!isRunning || isPaused || logIndex >= DEMO_LOGS.length) return

    const timer = setTimeout(() => {
      setLogs(prev => [...prev, DEMO_LOGS[logIndex]])
      setLogIndex(prev => prev + 1)
    }, Math.random() * 500 + 200)

    return () => clearTimeout(timer)
  }, [isRunning, isPaused, logIndex])

  // Auto-scroll
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [logs])

  const levelColor = (level: string) => {
    switch (level) {
      case 'INFO': return 'text-success'
      case 'WARNING': return 'text-yellow-400'
      case 'ERROR': return 'text-red-400 glow-red'
      case 'DEBUG': return 'text-muted-foreground'
      default: return 'text-foreground'
    }
  }

  const handleStart = () => { setIsRunning(true); setIsPaused(false); }
  const handlePause = () => setIsPaused(!isPaused)
  const handleStop = () => { setIsRunning(false); setIsPaused(false); }
  const handleClear = () => { setLogs([]); setLogIndex(0); setIsRunning(false); setIsPaused(false); }

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Live Terminal</h2>
          <p className="text-muted-foreground text-sm mt-1">Real-time scan output and log streaming</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleStart}
            disabled={isRunning && !isPaused}
            className="px-3 py-2 text-sm bg-success/10 text-success rounded-md disabled:opacity-50 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" /> Start
          </button>
          <button
            onClick={handlePause}
            disabled={!isRunning}
            className="px-3 py-2 text-sm bg-yellow-400/10 text-yellow-400 rounded-md disabled:opacity-50 flex items-center gap-1.5"
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={handleStop}
            disabled={!isRunning}
            className="px-3 py-2 text-sm bg-red-400/10 text-red-400 rounded-md disabled:opacity-50 flex items-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" /> Stop
          </button>
          <button onClick={handleClear} className="px-3 py-2 text-sm bg-secondary rounded-md flex items-center gap-1.5">
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
      </div>

      <div
        ref={terminalRef}
        className="flex-1 bg-background border border-border rounded-lg p-4 overflow-auto font-mono text-sm min-h-[500px] max-h-[calc(100vh-200px)]"
      >
        {logs.length === 0 && (
          <div className="text-muted-foreground">
            <span className="text-primary">root@recon</span>:<span className="text-blue-400">~</span>$ <span className="animate-pulse">_</span>
          </div>
        )}
        {logs.map((log, i) => (
          <div key={i} className="flex gap-2 py-0.5 leading-6">
            <span className="text-muted-foreground shrink-0">[{log.timestamp}]</span>
            <span className={`${levelColor(log.level)} shrink-0 w-16`}>{log.level}</span>
            <span className="text-primary/70 shrink-0">{log.stage}</span>
            <span className="text-foreground">{log.message}</span>
          </div>
        ))}
        {isRunning && !isPaused && logIndex >= DEMO_LOGS.length && (
          <div className="text-success mt-2">
            Scan complete. <span className="animate-pulse">█</span>
          </div>
        )}
        {isRunning && !isPaused && logIndex < DEMO_LOGS.length && (
          <div className="text-primary mt-2 animate-pulse">█</div>
        )}
      </div>
    </div>
  )
}
