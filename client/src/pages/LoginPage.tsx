import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

function LoginPage() {

    const navigate = useNavigate();
    const { login } = useAuthStore();
    const { logout } = useAuthStore();

    const[agentCode, setAgentCode] = useState('');
    const[password, setPassword] = useState('');

    useEffect(() => {
        logout();
    }, [])

    const handleLogin = async () => {
        const response = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ agentCode, password })
        });
        const result = await response.json();
        if (response.ok) {         
            localStorage.setItem("token", result.token);
            login(result.user);
            if (result.user.role === "admin") 
                navigate("/admin-dashboard");
            else if (result.user.role === "agent") 
                navigate("/agent-dashboard");
        } 
        else 
            alert(result.message);
    }

  return (
    <div className="login-page">
        <h1>Login Page</h1>
        <div>
            <label htmlFor="agentCode">Agent Code: </label>
            <input type="text" id="agentCode" name="agentCode" value={agentCode} onChange={(e) => setAgentCode(e.target.value)} />
        </div>
        <div>
            <label htmlFor="password">Password: </label>
            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button id="button" onClick={handleLogin}>Login</button>
    </div>
  )
}

export default LoginPage