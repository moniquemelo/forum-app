import { useState } from 'react';
import { auth } from '../api/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css'; 

export async function handleLogin(e, email, password) {
  e.preventDefault();
  await signInWithEmailAndPassword(auth, email, password);
}

export default function Login () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="login-container"> 
      <h2>Login</h2>
      <form onSubmit={(e) => handleLogin(e, email, password)}> 
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
    </div>
  );
}
