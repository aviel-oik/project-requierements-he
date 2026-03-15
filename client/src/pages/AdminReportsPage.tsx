// import React from 'react'

import { useEffect, useState } from "react";

interface report{
  id: string;
  category: string;
  message: string;
  imageUrl?: string;
}

function AdminReportsPage() {

  const [reports, setReports] = useState<report[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [agentCodeFilter, setAgentCodeFilter] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");

  useEffect(() => { 
    const fetchReports = async () => {
      const res = await fetch(`http://localhost:3000/reports?category=${categoryFilter}&agentCode=${agentCodeFilter}&urgency=${urgencyFilter}`,{
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`}
      });
      const data = await res.json();
      setReports(data);
    }
    fetchReports();
    // log the imageUrl of the first report for debugging
    console.log("First report imageUrl:", reports[0]?.imageUrl);
  }, [categoryFilter, agentCodeFilter, urgencyFilter]);

  return (
    <div className="admin-reports-page">
      <h1>Admin Reports</h1>
      <div className="admin-reports-filters">
        <h2>Filters: </h2>
        <input type="text" placeholder="by categorie" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} />
        <input type="text" placeholder="by agentCode" value={agentCodeFilter} onChange={(e) => setAgentCodeFilter(e.target.value)} />
        <input type="text" placeholder="by urgency" value={urgencyFilter} onChange={(e) => setUrgencyFilter(e.target.value)} />
      </div>
      <div className="admin-reports-list">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Message</th>
              <th>Image</th>
            </tr>  
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.id}</td>
                <td>{report.category}</td>
                <td>{report.message}</td>
                {report.imageUrl && (
                  <td>
                    <img src={report.imageUrl} alt="Report" style={{ width: "100px", height: "100px" }} />
                  </td>
                )}

              </tr>
            ))}
          </tbody>
        </ table>
      </div>

    </div>
  )
}

export default AdminReportsPage