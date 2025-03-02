import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '../context/AuthContext';
import '../styles/UserAuth.scss';

const UserAuth = ({ isSignUp = false }) => {
  // State for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authMode, setAuthMode] = useState(isSignUp ? 'signup' : 'login');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn, signUp, loading } = useAuthState();
  const navigate = useNavigate();
  
  // Switch between login and signup modes
  const toggleAuthMode = () => {
    setErrorMessage('');
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
  };
  
  // Form validation
  const validateForm = () => {
    if (!email || !password) {
      setErrorMessage('Email and password are required');
      return false;
    }
    
    if (authMode === 'signup' && !name) {
      setErrorMessage('Name is required for signup');
      return false;
    }
    
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }
    
    return true;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      if (authMode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password, name);
      }
      // Redirect to home page on success
      navigate('/');
    } catch (error) {
      console.error('Authentication error:', error);
      
      // Display user-friendly error messages
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setErrorMessage('Invalid email or password');
          break;
        case 'auth/email-already-in-use':
          setErrorMessage('Email is already in use');
          break;
        case 'auth/network-request-failed':
          setErrorMessage('Network error. Please check your connection');
          break;
        default:
          setErrorMessage(error.message || 'An error occurred during authentication');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{authMode === 'login' ? 'Login' : 'Create Account'}</h2>
        
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {authMode === 'signup' && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                disabled={isSubmitting}
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isSubmitting}
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading
              ? 'Please wait...'
              : authMode === 'login'
                ? 'Login'
                : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-switch">
          {authMode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button onClick={toggleAuthMode}>Sign Up</button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={toggleAuthMode}>Login</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAuth;