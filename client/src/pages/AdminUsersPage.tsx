import {useState, useEffect} from "react";

interface User {
  id: number;
  agentCode: string;
  fullName: string;
  role: string;
}
// fullmwne error losdding 

function AdminUsersPage() {

  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ fullName: '', agentCode: '', role: '', password: ''});

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('http://localhost:3000/admin/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`}
      });
      const data = await response.json();
      setUsers(data);
    }
    fetchUsers();
  }, []);

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(newUser)
    });
    const result = await response.json();
    setUsers([...users, result.user]);
    setNewUser({ fullName: '', agentCode: '', role: '', password: '' });
  };

  return (
    <div className="admin-users-page">
      <h1>Admin Users</h1>
      <div className="admin-users-list">
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Agent Code</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.fullName}</td>
                <td>{user.agentCode}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="admin-users-new-user">
          <h2>Add New User</h2>
          <form onSubmit={addUser}>
            <input type="text" placeholder="Full Name" value={newUser.fullName} onChange={(e) => setNewUser({...newUser, fullName: e.target.value})} />
            <input type="text" placeholder="Agent Code" value={newUser.agentCode} onChange={(e) => setNewUser({...newUser, agentCode: e.target.value})} />
            <div className="admin-users-new-user-role">
              <label htmlFor="role">Role:</label>
              <select name="role" value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})} >
                <option value="admin">Admin</option>
                <option value="agent">Agent</option>
              </select>
            </div>
            <input type="text" placeholder="Password (facultatif)" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} />
            <button type="submit">Add User</button>
          </form>
      </div>
    </div>
  )
}

export default AdminUsersPage