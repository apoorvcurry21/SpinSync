import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '../contexts/AuthContext';
import '../styles/Dashboard.scss';

const Dashboard = () => {
  const { user, userProfile } = useAuthState();
  const navigate = useNavigate();
  const [recentTables, setRecentTables] = useState([]);
  const [recentPlayers, setRecentPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Here you would fetch recent tables and players from Firestore
    // This is a placeholder implementation
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Mock data - in a real app, this would be fetched from Firestore
        setRecentTables([
          { id: '1', name: 'Community Center Table', location: 'Downtown', condition: 'Excellent' },
          { id: '2', name: 'Park District Table', location: 'West Side', condition: 'Good' },
        ]);
        
        setRecentPlayers([
          { id: '1', name: 'Alex Chen', skillLevel: 'Intermediate', location: 'Downtown' },
          { id: '2', name: 'Sam Wilson', skillLevel: 'Advanced', location: 'East Side' },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading dashboard data...</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Welcome, {userProfile?.name || user?.displayName || 'Player'}</h2>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Your Activity</h3>
          <div className="stat-value">3</div>
          <div className="stat-label">Recent Games</div>
        </div>
        <div className="stat-card">
          <h3>Skill Level</h3>
          <div className="stat-value">{userProfile?.skillLevel || 'Not set'}</div>
          <div className="stat-label">Current Rating</div>
        </div>
        <div className="stat-card">
          <h3>Connections</h3>
          <div className="stat-value">5</div>
          <div className="stat-label">Fellow Players</div>
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Nearby Tables</h3>
        <div className="card-grid">
          {recentTables.length > 0 ? (
            recentTables.map(table => (
              <div key={table.id} className="card">
                <h4>{table.name}</h4>
                <p><span>Location:</span> {table.location}</p>
                <p><span>Condition:</span> {table.condition}</p>
                <button className="view-button">View Details</button>
              </div>
            ))
          ) : (
            <p className="no-data">No tables found nearby</p>
          )}
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Players Near You</h3>
        <div className="card-grid">
          {recentPlayers.length > 0 ? (
            recentPlayers.map(player => (
              <div key={player.id} className="card">
                <h4>{player.name}</h4>
                <p><span>Skill Level:</span> {player.skillLevel}</p>
                <p><span>Location:</span> {player.location}</p>
                <button className="connect-button">Connect</button>
              </div>
            ))
          ) : (
            <p className="no-data">No players found nearby</p>
          )}
        </div>
      </div>

      <div className="dashboard-actions">
        <button 
          className="action-button primary"
          onClick={() => navigate('/find-tables')}
        >
          Find Tables
        </button>
        <button 
          className="action-button secondary"
          onClick={() => navigate('/find-players')}
        >
          Find Players
        </button>
        <button 
          className="action-button tertiary"
          onClick={() => navigate('/profile')}
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default Dashboard;