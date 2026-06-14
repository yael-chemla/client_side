import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useAuth } from "../../Hooks/UserContext"; 
import { LoginUser } from "../../API/auth.js";
import '../../CSS/auth.css';
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const { isAuthenticated, login } = useAuth(); 
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/projects" replace />;
  }

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const data = await LoginUser(email, password);
    
    if (data && data.token) {
      login(data.token, data.user); 
      navigate("/projects");
    }
  } catch (err) {
    setError(err.message); 
  }
};
  
  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>התחברות</h2>
        {error && <p className="error-message">{error}</p>}
        
        <input type="email" placeholder="אימייל" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="סיסמה" value={password} onChange={(e) => setPassword(e.target.value)} required />
        
        <button type="submit">התחבר</button>
        <p>אין לך חשבון עדיין? <Link to="/register">הירשם עכשיו</Link></p>
      </form>
    </div>
  );
}