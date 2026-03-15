// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import AgentDashboardPage from './pages/AgentDashboardPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import NewReportPage from './pages/NewReportPage'
import CsvUploadPage from './pages/CsvUploadPage'
import MyReportsPage from './pages/MyReportsPage'
import AdminUsersPage from './pages/AdminUsersPage'
import AdminReportsPage from './pages/AdminReportsPage'
import FreeStyle from './pages/FreeStyle'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/agent-dashboard" element={<ProtectedRoute requiredRole="agent"><AgentDashboardPage /></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboardPage /></ProtectedRoute>} />
        <Route path="/new-report" element={<ProtectedRoute requiredRole="agent"><NewReportPage /></ProtectedRoute>} />
        <Route path="/csv-upload" element={<ProtectedRoute requiredRole="agent"><CsvUploadPage /></ProtectedRoute>} />
        <Route path="/my-reports" element={<ProtectedRoute requiredRole="agent"><MyReportsPage /></ProtectedRoute>} />
        <Route path="/admin-users" element={<ProtectedRoute requiredRole="admin"><AdminUsersPage /></ProtectedRoute>} />
        <Route path="/admin-reports" element={<ProtectedRoute requiredRole="admin"><AdminReportsPage /></ProtectedRoute>} />
        <Route path='/free' element={<FreeStyle />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
