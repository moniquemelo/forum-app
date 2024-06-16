import { useAuth } from '../contexts/AuthContext';
import './Profile.css';

export default function Profile() {
  const { currentUser } = useAuth();

  return (
    <div className="profile-container">
      <h2>Perfil</h2>
      {currentUser ? (
        <div>
          <p><strong>Email:</strong> {currentUser.email}</p>
        </div>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
}


