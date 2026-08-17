import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/index.js';
import { usePersistentPlayer } from './hooks/usePersistentPlayer.js';

// Pages
import Login from './pages/Auth/Login.jsx';
import Signup from './pages/Auth/Signup.jsx';
import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import Library from './pages/Library.jsx';
import Profile from './pages/Profile.jsx';

// Components
import Sidebar from './components/Sidebar.jsx';
import MusicPlayer from './components/MusicPlayer.jsx';

// Protected Route
function ProtectedRoute({ children }) {
  const { user, token } = useAuthStore();
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const { user, token, getMe } = useAuthStore();
  usePersistentPlayer();

  useEffect(() => {
    if (token && !user) {
      getMe().catch(() => {
        // Token might be invalid, user will be redirected to login
      });
    }
  }, [token, user]);

  return (
    <Router>
      <div className="bg-gray-950 text-white">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <div className="flex h-screen">
                  <Sidebar />
                  <main className="flex-1 ml-64">
                    <Home />
                  </main>
                  <MusicPlayer />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <div className="flex h-screen">
                  <Sidebar />
                  <main className="flex-1 ml-64">
                    <Search />
                  </main>
                  <MusicPlayer />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <div className="flex h-screen">
                  <Sidebar />
                  <main className="flex-1 ml-64">
                    <Library />
                  </main>
                  <MusicPlayer />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <div className="flex h-screen">
                  <Sidebar />
                  <main className="flex-1 ml-64">
                    <Profile />
                  </main>
                  <MusicPlayer />
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
