import { useState } from 'react';
import { auth } from '../api/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css'; 

export default function Login () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container"> 
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="login-input" 
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="login-input" 
        />
        <button type="submit" className="login-button">Login</button> 
      </form>
      {error && <p className="error-message">{error}</p>} 
    </div>
  );
}
