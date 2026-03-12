// import React from 'react'
import { useNavigate } from 'react-router-dom';

function AdminDashboardPage() {

  const navigate = useNavigate();

  return (
    <div className="admin-dashboard-page">
        <h1>Admin Dashboard</h1>
        <div className='admin-dashboard-btns'>
          <button onClick={() => navigate('/admin-users')}>Manage Users</button>
          <button onClick={() => navigate('/admin-reports')}>Manage Reports</button>
        </div>
    </div>  )
}

export default AdminDashboardPage