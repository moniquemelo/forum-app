import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logout from './Logout';
import './Navbar.css';

export default function Navbar() {
  const { currentUser } = useAuth();

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/" className="navbar-link">Home</Link>
        </li>
        {currentUser && (
          <>
            <li className="navbar-item">
              <Link to="/ranking" className="navbar-link">Ranking</Link>
            </li>
            <li className="navbar-item">
              <Link to="/profile" className="navbar-link">Perfil</Link>
            </li>
            <li className="navbar-item">
              <Logout />
            </li>
          </>
        )}
        {!currentUser && (
          <li className="navbar-item">
            <Link to="/login" className="navbar-link">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}


