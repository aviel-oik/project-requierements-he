import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function LoginPage() {

    const navigate = useNavigate();

    const[agentCode, setAgentCode] = useState('');
    const[password, setPassword] = useState('');

    const login = async () => {
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
        <button id="button" onClick={login}>Login</button>
    </div>
  )
}

export default LoginPage