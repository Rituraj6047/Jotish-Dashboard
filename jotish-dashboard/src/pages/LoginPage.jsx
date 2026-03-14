import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/auth.module.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (isLoggedIn) {
    return <Navigate to="/list" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(username, password);
    if (result) {
      setErrorMsg(result);
    } else {
      navigate("/list");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.card}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          className={styles.input} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          className={styles.input} 
        />
        <button type="submit" className={styles.button}>Login</button>
        {errorMsg && <div className={styles.error}>{errorMsg}</div>}
      </form>
    </div>
  );
}
