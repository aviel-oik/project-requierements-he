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

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/agent-dashboard" element={<AgentDashboardPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
        <Route path="/new-report" element={<NewReportPage />} />
        <Route path="/csv-upload" element={<CsvUploadPage />} />
        <Route path="/my-reports" element={<MyReportsPage />} />
        <Route path="/admin-users" element={<AdminUsersPage />} />
        <Route path="/admin-reports" element={<AdminReportsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
