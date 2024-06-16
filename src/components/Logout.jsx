import { auth } from '../api/firebase';
import { signOut } from 'firebase/auth';
import './Logout.css'

const Logout = () => {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <button onClick={handleLogout} className="navbar-link">Logout</button>
  );
};

export default Logout;
