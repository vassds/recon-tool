export interface Project {
  id: string
  name: string
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Target {
  id: string
  project_id: string
  value: string
  target_type: 'domain' | 'ip' | 'cidr' | 'url' | 'username' | 'email'
  status: string
  tags: string[]
  notes: string
  scope_confirmed: boolean
  excluded_hosts: string[]
  included_ports: number[]
  excluded_ports: number[]
  scan_profile: string
  created_at: string
  updated_at: string
}

export interface ScanJob {
  id: string
  scan_id: string
  project_id: string
  target_id: string
  scan_type: string
  profile: string
  status: 'pending' | 'queued' | 'running' | 'completed' | 'failed' | 'cancelled'
  progress: number
  current_stage: string
  stages_config: Record<string, boolean>
  results_summary: Record<string, any>
  started_at: string | null
  completed_at: string | null
  created_at: string
  error_message: string | null
}

export interface DNSRecord {
  id: string
  scan_id: string
  domain: string
  record_type: string
  record_value: string
  ttl: number | null
  priority: number | null
  source: string
  first_seen: string
  last_seen: string
}

export interface SubdomainEntry {
  id: string
  scan_id: string
  hostname: string
  resolved_ip: string | null
  cname: string | null
  http_status: number | null
  title: string | null
  technology: string | null
  open_ports: number[]
  source: string
  is_alive: boolean
  first_seen: string
  last_seen: string
}

export interface PortEntry {
  id: string
  scan_id: string
  host: string
  ip_address: string | null
  port_number: number
  protocol: string
  state: string
  service_name: string | null
  version: string | null
  banner: string | null
  confidence: number
  source: string
  first_seen: string
  last_seen: string
}

export interface ServiceEntry {
  id: string
  scan_id: string
  host: string
  port_number: number
  protocol: string
  service_type: string
  status_code: number | null
  title: string | null
  server_header: string | null
  technologies: string[]
  redirect_url: string | null
  tls_info: Record<string, any>
  headers: Record<string, any>
  source: string
  first_seen: string
  last_seen: string
}

export interface TechnologyEntry {
  id: string
  scan_id: string
  host: string
  technology_name: string
  version: string | null
  category: string | null
  evidence: string | null
  confidence: number
  source: string
  first_seen: string
  last_seen: string
}

export interface WebURL {
  id: string
  scan_id: string
  url: string
  domain: string
  status_code: number | null
  title: string | null
  server: string | null
  technology: string[]
  content_type: string | null
  response_size: number | null
  redirect_url: string | null
  tls_valid: boolean | null
  depth: number
  source: string
  first_seen: string
  last_seen: string
}

export interface Finding {
  id: string
  scan_id: string
  title: string
  description: string | null
  severity: 'informational' | 'low' | 'medium' | 'high' | 'critical'
  asset: string | null
  asset_type: string | null
  evidence: string | null
  detection_method: string | null
  confidence: number
  status: string
  notes: string
  references: string[]
  cve_id: string | null
  first_seen: string
  last_seen: string
}

export interface ScanLog {
  id: string
  scan_id: string
  timestamp: string
  level: string
  stage: string
  message: string
  details: Record<string, any> | null
}

export interface AssetStats {
  subdomains: number
  ip_addresses: number
  open_ports: number
  services: number
  technologies: number
  urls: number
  findings: number
  findings_by_severity: Record<string, number>
}
