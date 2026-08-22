import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { Dashboard } from './pages/Dashboard'
import { Targets } from './pages/Targets'
import { PassiveRecon } from './pages/PassiveRecon'
import { ActiveRecon } from './pages/ActiveRecon'
import { Subdomains } from './pages/Subdomains'
import { DNSIntelligence } from './pages/DNSIntelligence'
import { PortScanner } from './pages/PortScanner'
import { WebRecon } from './pages/WebRecon'
import { Technology } from './pages/Technology'
import { OSINT } from './pages/OSINT'
import { Findings } from './pages/Findings'
import { ScanHistory } from './pages/ScanHistory'
import { Reports } from './pages/Reports'
import { Settings } from './pages/Settings'
import { ScanTerminal } from './pages/ScanTerminal'
import { AttackSurface } from './pages/AttackSurface'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-auto p-6">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/targets" element={<Targets />} />
                <Route path="/passive-recon" element={<PassiveRecon />} />
                <Route path="/active-recon" element={<ActiveRecon />} />
                <Route path="/subdomains" element={<Subdomains />} />
                <Route path="/dns" element={<DNSIntelligence />} />
                <Route path="/ports" element={<PortScanner />} />
                <Route path="/web-recon" element={<WebRecon />} />
                <Route path="/technology" element={<Technology />} />
                <Route path="/osint" element={<OSINT />} />
                <Route path="/findings" element={<Findings />} />
                <Route path="/attack-surface" element={<AttackSurface />} />
                <Route path="/scan-history" element={<ScanHistory />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/terminal" element={<ScanTerminal />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
