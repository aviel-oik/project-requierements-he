// import React from 'react'
import { useNavigate } from 'react-router-dom';


function AgentDashboardPage() {

  const navigate = useNavigate();

  return (
    <div className="agent-dashboard-page">
        <h1>Agent Dashboard</h1>
        <div className='agent-dashboard-btns'>
          <button onClick={() => navigate('/csv-upload')}>New Report - CSV</button>
          <button onClick={() => navigate('/new-report')}>New Report - Manual</button>
          <button onClick={() => navigate('/my-reports')}>View Reports</button>
        </div>
    </div>
  )
}

export default AgentDashboardPage