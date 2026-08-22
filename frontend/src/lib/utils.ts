import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function severityColor(severity: string) {
  const colors: Record<string, string> = {
    critical: 'text-red-400 bg-red-400/10 border-red-400/20',
    high: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    low: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    informational: 'text-muted-foreground bg-muted/10 border-muted/20',
  }
  return colors[severity] || colors.informational
}

export function statusColor(status: string) {
  const colors: Record<string, string> = {
    running: 'text-primary glow-blue',
    completed: 'text-success glow-green',
    failed: 'text-red-400 glow-red',
    cancelled: 'text-muted-foreground',
    pending: 'text-yellow-400',
    open: 'text-success glow-green',
  }
  return colors[status] || 'text-muted-foreground'
}
