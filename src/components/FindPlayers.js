import React, { useState, useEffect } from 'react';
import { firestore } from '../firebaseConfig';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { useAuthState } from '../contexts/AuthContext';
import '../styles/FindPlayers.scss';

const FindPlayers = () => {
  const { user, userProfile } = useAuthState();
  
  // State for filter parameters
  const [location, setLocation] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [availability, setAvailability] = useState('');
  const [playingStyle, setPlayingStyle] = useState('');
  
  // State for player data
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch all players on component mount
  useEffect(() => {
    fetchPlayers();
  }, []);
  
  // Apply user profile to filters when it loads
  useEffect(() => {
    if (userProfile) {
      // Pre-fill filters from user profile if available
      if (userProfile.location?.city) {
        setLocation(userProfile.location.city);
      }
    }
  }, [userProfile]);
  
  // Apply filters when parameters change
  useEffect(() => {
    applyFilters();
  }, [players, location, skillLevel, availability, playingStyle]);
  
  // Fetch players from Firestore
  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const playersQuery = query(
        collection(firestore, 'users'),
        orderBy('name'),
        limit(100) // Limit to 100 results for performance
      );
      
      const querySnapshot = await getDocs(playersQuery);
      const playersData = [];
      
      querySnapshot.forEach((doc) => {
        // Don't include the current user in the results
        if (user && doc.id === user.uid) return;
        
        const data = doc.data();
        // Only include users with at least basic profile data
        if (data.name) {
          playersData.push({
            id: doc.id,
            ...data
          });
        }
      });
      
      setPlayers(playersData);
      setFilteredPlayers(playersData);
      setError(null);
    } catch (err) {
      console.error('Error fetching players:', err);
      setError('Failed to load players. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Apply filters to the players list
  const applyFilters = () => {
    if (!players.length) return;
    
    let result = [...players];
    
    // Filter by location
    if (location.trim()) {
      result = result.filter(player => {
        return player.location && 
          (player.location.city?.toLowerCase().includes(location.toLowerCase()) ||
           player.location.state?.toLowerCase().includes(location.toLowerCase()));
      });
    }
    
    // Filter by skill level
    if (skillLevel) {
      result = result.filter(player => player.skillLevel === skillLevel);
    }
    
    // Filter by availability
    if (availability) {
      result = result.filter(player => 
        player.availability && player.availability.includes(availability)
      );
    }
    
    // Filter by playing style
    if (playingStyle) {
      result = result.filter(player => player.playingStyle === playingStyle);
    }
    
    setFilteredPlayers(result);
  };
  
  // Match the user's skill level
  const handleMatchMySkill = () => {
    if (userProfile && userProfile.skillLevel) {
      setSkillLevel(userProfile.skillLevel);
    } else {
      alert('Please complete your profile with your skill level first.');
    }
  };
  
  // Handle the search submission
  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };
  
  // Reset all filters
  const handleReset = () => {
    setLocation('');
    setSkillLevel('');
    setAvailability('');
    setPlayingStyle('');
  };
  
  // Initialize connection with another player
  const handleConnect = (player) => {
    if (!user) {
      alert('Please log in to connect with players.');
      return;
    }
    
    // In a real app, this would send a connection request
    alert(`Connection request sent to ${player.name}!`);
  };
  
  return (
    <div className="find-players-container">
      <h2>Find Table Tennis Players</h2>
      
      <form className="filter-container" onSubmit={handleSearch}>
        <div className="filter-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City or state"
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="skill-level">
            Skill Level
            <button
              type="button"
              className="match-button"
              onClick={handleMatchMySkill}
              disabled={!userProfile?.skillLevel}
            >
              Match My Skill
            </button>
          </label>
          <select
            id="skill-level"
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
          >
            <option value="">Any Skill Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Professional">Professional</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="availability">Availability</label>
          <select
            id="availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          >
            <option value="">Any Time</option>
            <option value="Weekday Mornings">Weekday Mornings</option>
            <option value="Weekday Afternoons">Weekday Afternoons</option>
            <option value="Weekday Evenings">Weekday Evenings</option>
            <option value="Weekend Mornings">Weekend Mornings</option>
            <option value="Weekend Afternoons">Weekend Afternoons</option>
            <option value="Anytime">Anytime</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="playing-style">Playing Style</label>
          <select
            id="playing-style"
            value={playingStyle}
            onChange={(e) => setPlayingStyle(e.target.value)}
          >
            <option value="">Any Style</option>
            <option value="Offensive">Offensive</option>
            <option value="Defensive">Defensive</option>
            <option value="All-Round">All-Round</option>
            <option value="Aggressive">Aggressive</option>
            <option value="Counter-Attack">Counter-Attack</option>
            <option value="Chopper">Chopper</option>
            <option value="Blocker">Blocker</option>
            <option value="Power Hitter">Power Hitter</option>
            <option value="Looper">Looper</option>
            <option value="Technical">Technical</option>
          </select>
        </div>
        
        <button type="submit" className="search-button">
          Search Players
        </button>
        
        <button type="button" className="search-button" onClick={handleReset} style={{ backgroundColor: '#666' }}>
          Reset Filters
        </button>
      </form>
      
      <div className="players-list">
        {loading ? (
          <div className="loading-spinner">Loading players...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : filteredPlayers.length === 0 ? (
          <div className="no-results">
            No players found matching your criteria. Try adjusting your filters.
          </div>
        ) : (
          filteredPlayers.map((player) => (
            <div className="player-card" key={player.id}>
              <h3>{player.name}</h3>
              {player.location && (
                <p><span>Location:</span> {player.location.city}, {player.location.state}</p>
              )}
              {player.skillLevel && (
                <p><span>Skill Level:</span> {player.skillLevel}</p>
              )}
              {player.playingStyle && (
                <p><span>Playing Style:</span> {player.playingStyle}</p>
              )}
              {player.availability && player.availability.length > 0 && (
                <p><span>Availability:</span> {Array.isArray(player.availability) ? player.availability.join(', ') : player.availability}</p>
              )}
              {player.bio && (
                <p><span>Bio:</span> {player.bio}</p>
              )}
              {player.yearsPlaying && (
                <p><span>Experience:</span> {player.yearsPlaying} {player.yearsPlaying === 1 ? 'year' : 'years'}</p>
              )}
              <button
                className="connect-button"
                onClick={() => handleConnect(player)}
              >
                Connect
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FindPlayers;
