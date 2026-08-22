import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth
export const authAPI = {
  login: (data: { username: string; password: string }) => api.post('/auth/login', data),
  register: (data: { username: string; email: string; password: string }) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
}

// Projects
export const projectsAPI = {
  list: () => api.get('/projects'),
  create: (data: { name: string; description?: string }) => api.post('/projects', data),
  get: (id: string) => api.get(`/projects/${id}`),
  update: (id: string, data: any) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
}

// Targets
export const targetsAPI = {
  list: (projectId?: string) => api.get('/targets', { params: { project_id: projectId } }),
  create: (data: any, projectId: string) => api.post('/targets', data, { params: { project_id: projectId } }),
  bulkCreate: (data: any) => api.post('/targets/bulk', data),
  get: (id: string) => api.get(`/targets/${id}`),
  update: (id: string, data: any) => api.put(`/targets/${id}`, data),
  confirmScope: (id: string) => api.post(`/targets/${id}/confirm-scope`),
  delete: (id: string) => api.delete(`/targets/${id}`),
}

// Scans
export const scansAPI = {
  list: (projectId?: string, targetId?: string) => api.get('/scans', { params: { project_id: projectId, target_id: targetId } }),
  create: (data: any) => api.post('/scans', data),
  get: (id: string) => api.get(`/scans/${id}`),
  cancel: (id: string) => api.post(`/scans/${id}/cancel`),
  logs: (id: string) => api.get(`/scans/${id}/logs`),
  stats: () => api.get('/scans/stats'),
}

// Assets
export const assetsAPI = {
  stats: (projectId?: string) => api.get('/stats', { params: { project_id: projectId } }),
  dns: (params: any) => api.get('/dns', { params }),
  subdomains: (params: any) => api.get('/subdomains', { params }),
  ports: (params: any) => api.get('/ports', { params }),
  services: (params: any) => api.get('/services', { params }),
  technologies: (params: any) => api.get('/technologies', { params }),
  urls: (params: any) => api.get('/urls', { params }),
  findings: (params: any) => api.get('/findings', { params }),
  updateFinding: (id: string, data: any) => api.put(`/findings/${id}`, data),
}

// Reports
export const reportsAPI = {
  list: (projectId?: string) => api.get('/reports', { params: { project_id: projectId } }),
  create: (data: any) => api.post('/reports', data),
  get: (id: string) => api.get(`/reports/${id}`),
  download: (id: string) => `/api/reports/${id}/download`,
}

// OSINT
export const osintAPI = {
  list: (params: any) => api.get('/osint', { params }),
  search: (data: any) => api.post('/osint/search', data),
}

// Settings
export const settingsAPI = {
  get: () => api.get('/settings'),
  updateApiKeys: (data: any) => api.put('/settings/api-keys', data),
}

export default api
