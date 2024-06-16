import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import PostList from './components/PostList';
import Ranking from './components/Ranking';
import Login from './components/Login';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';


const App = () => {

  //Simulação dos pontos.
  const pontos = [
    { name: 'João das Neves', points: 150 },
    { name: 'Bob Marley', points: 120 },
    { name: 'Zeca Pagodinho', points: 100 },
  ];

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="App">
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/ranking" element={
                <ProtectedRoute>
                  <Ranking pontos={pontos} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
