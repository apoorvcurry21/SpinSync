import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from '../contexts/AuthContext';
import '../styles/Home.scss';

const Home = () => {
  const { user } = useAuthState();

  // Updated high-quality table tennis action shot
  const heroImageUrl = "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Elevate Your <span className="highlight">Table Tennis</span> Game</h1>
          <h2>Connect with players & find tables near you</h2>
          <div className="cta-buttons">
            {user ? (
              <>
                <Link to="/find-players" className="cta-button primary">Find Players</Link>
                <Link to="/find-tables" className="cta-button secondary">Find Tables</Link>
              </>
            ) : (
              <>
                <Link to="/login" className="cta-button primary">Get Started</Link>
                <Link to="/find-tables" className="cta-button secondary">Explore Tables</Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-image">
          <img src={heroImageUrl} alt="Table tennis players in action" />
        </div>
      </section>

      <section className="stats-section">
        <div className="stat-item">
          <span className="stat-number">100+</span>
          <span className="stat-label">Tables</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">50+</span>
          <span className="stat-label">Players</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">25</span>
          <span className="stat-label">Cities</span>
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose SpinSync?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Match By Skill</h3>
            <p>Find players at your level for the perfect competitive match.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>Discover Tables</h3>
            <p>Locate quality tables with detailed information on facilities.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Connect Instantly</h3>
            <p>Our app makes it easy to arrange games and meet new players.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌟</div>
            <h3>Track Progress</h3>
            <p>Build your profile and showcase your skills and style.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create Your Profile</h3>
            <p>Sign up and complete your player profile with your skill level and playing style.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Find Players or Tables</h3>
            <p>Search for players matching your criteria or locate tables in your area.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Connect and Play</h3>
            <p>Reach out to players, schedule games, and enjoy playing table tennis!</p>
          </div>
        </div>
        <div className="get-started">
          {!user && (
            <Link to="/login" className="cta-button primary">Get Started Now</Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home; 