import {useState, useEffect} from "react";

interface report{
  id: string;
  category: string;
  message: string;
}

function MyReportsPage() {

  const [reports, setReports] = useState<report[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      const res = await fetch("http://localhost:3000/reports",{
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`}
      });
      const data = await res.json();
      setReports(data);
    }
    fetchReports();
  });

  return (
    <div className="agent-reports-page">
      <h1>My Reports</h1>
      <div className="agent-reports-list">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Message</th>
            </tr>  
          </thead>

          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.id}</td>
                <td>{report.category}</td>
                <td>{report.message}</td>
              </tr>
            ))}
          </tbody>
        </ table>
      </div>
    </div>
  )
}

export default MyReportsPage