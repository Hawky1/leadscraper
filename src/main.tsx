import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './components/AuthProvider'
import AuthenticatedLayout from './components/AuthenticatedLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import LeadGeneration from './pages/LeadGeneration'
import Roadmap from './pages/Roadmap'
import ComingSoon from './pages/ComingSoon'
import Landing from './pages/Landing'
import './index.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Landing />} />
            <Route element={<AuthenticatedLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/lead-gen" element={<LeadGeneration />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/prompt-builder" element={<ComingSoon />} />
              <Route path="/objection-handling" element={<ComingSoon />} />
              <Route path="/gpts" element={<ComingSoon />} />
              <Route path="/voice-agent" element={<ComingSoon />} />
              <Route path="/sora" element={<ComingSoon />} />
              <Route path="/app-builder" element={<ComingSoon />} />
              <Route path="/help" element={<ComingSoon />} />
              <Route path="/settings" element={<ComingSoon />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
