import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthState } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { auth } from '../firebaseConfig';
import { logOut } from '../utils/auth';
import '../styles/Navbar.scss';

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme, isDarkTheme } = useTheme();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      // Redirect to homepage after logout
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          <span className="logo-text">SpinSync</span>
          <span className="logo-icon">🏓</span>
        </Link>

        <div className={`menu-toggle ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li className={isActive('/')}>
            <Link to="/" onClick={closeMenu}>Home</Link>
          </li>
          <li className={isActive('/find-players')}>
            <Link to="/find-players" onClick={closeMenu}>Find Players</Link>
          </li>
          <li className={isActive('/find-tables')}>
            <Link to="/find-tables" onClick={closeMenu}>Find Tables</Link>
          </li>
          {currentUser ? (
            <>
              <li className={isActive('/profile')}>
                <Link to="/profile" onClick={closeMenu}>My Profile</Link>
              </li>
              <li className="auth-button">
                <button className="logout-button" onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <li className="auth-button">
              <Link to="/login" className="login-button" onClick={closeMenu}>Login</Link>
            </li>
          )}
          <li>
            <button 
              className="theme-toggle" 
              onClick={toggleTheme} 
              aria-label="Toggle dark mode"
            >
              {isDarkTheme ? '☀️' : '🌙'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
