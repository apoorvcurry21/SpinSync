import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';
import FindTables from './components/FindTables';
import FindPlayers from './components/FindPlayers';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.scss';

// Import PopulateDatabaseButton only in development mode
const PopulateDatabaseButton = process.env.NODE_ENV === 'development' 
  ? React.lazy(() => import('./components/PopulateDatabaseButton'))
  : null;

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for smooth transitions
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="app-loader">
        <div className="spinner"></div>
        <p>Loading SpinSync...</p>
      </div>
    );
  }

  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/find-tables" element={
                  <ProtectedRoute>
                    <FindTables />
                  </ProtectedRoute>
                } />
                <Route path="/find-players" element={
                  <ProtectedRoute>
                    <FindPlayers />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>

            {/* Render PopulateDatabaseButton only in development mode */}
            {process.env.NODE_ENV === 'development' && PopulateDatabaseButton && (
              <React.Suspense fallback={<div />}>
                <div className="populate-db-button-container">
                  <PopulateDatabaseButton />
                </div>
              </React.Suspense>
            )}
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;