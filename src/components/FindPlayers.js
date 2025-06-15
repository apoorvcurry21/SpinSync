import React, { useState, useEffect } from 'react';
import { firestore } from '../firebaseConfig';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { useAuthState } from '../contexts/AuthContext';
import '../styles/FindPlayers.scss';

const FindPlayers = () => {
  const { user, userProfile } = useAuthState();
  
  // Basic filters
  const [location, setLocation] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [playingStyle, setPlayingStyle] = useState('');
  const [availability, setAvailability] = useState('');
  
  // Advanced filters
  const [playingHand, setPlayingHand] = useState('');
  const [gripStyle, setGripStyle] = useState('');
  const [ratingRange, setRatingRange] = useState({ min: 0, max: 3000 });
  const [yearsPlaying, setYearsPlaying] = useState('');
  const [trainingPreference, setTrainingPreference] = useState('');
  const [tournament, setTournament] = useState('');
  const [language, setLanguage] = useState('');
  const [equipment, setEquipment] = useState({ brand: '', rubber: '' });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Data states
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Constants for filter options
  const skillLevels = ["Beginner", "Intermediate", "Advanced", "Professional"];
  const playingStyles = [
    "Offensive", "Defensive", "All-Round", "Aggressive", "Counter-Attack", 
    "Chopper", "Blocker", "Power Hitter", "Looper", "Technical"
  ];
  const availabilityOptions = [
    "Weekday Mornings", "Weekday Afternoons", "Weekday Evenings",
    "Weekend Mornings", "Weekend Afternoons", "Weekend Evenings",
    "Anytime"
  ];
  const playingHands = ["Right-Handed", "Left-Handed", "Ambidextrous"];
  const gripStyles = ["Shakehand", "Penhold", "Seemiller"];
  const trainingPreferences = [
    "Practice Partner", "Competitive Matches", "Casual Games",
    "Tournament Preparation", "Technique Training", "Coaching Sessions"
  ];
  const tournaments = [
    "Local Leagues", "State Championships", "National Tournaments",
    "Club Competitions", "Corporate Tournaments", "Regional Championships"
  ];
  const languages = [
    "English", "Hindi", "Tamil", "Telugu", "Bengali",
    "Marathi", "Gujarati", "Kannada", "Malayalam"
  ];
  const equipmentBrands = [
    "Butterfly", "Stiga", "DHS", "Donic", "Joola",
    "Yasaka", "Tibhar", "Xiom", "Nittaku"
  ];
  const rubberTypes = [
    "Tenergy 05", "Hurricane 3", "Rakza 7", "Evolution MX-P",
    "Fastarc G-1", "Mark V", "Dignics 09C", "Rasanter R47"
  ];

  // Fetch players on mount
  useEffect(() => {
    fetchPlayers();
  }, []);

  // Update locations when players change
  useEffect(() => {
    if (players.length > 0) {
      const locations = new Set();
      players.forEach(player => {
        if (player.location?.city && player.location?.state) {
          locations.add(`${player.location.city}, ${player.location.state}`);
        }
      });
      setAvailableLocations(Array.from(locations).sort());
    }
  }, [players]);

  // Apply filters when parameters change
  useEffect(() => {
    applyFilters();
  }, [
    players, location, skillLevel, playingStyle, availability,
    playingHand, gripStyle, ratingRange, yearsPlaying,
    trainingPreference, tournament, language, equipment
  ]);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const playersQuery = query(
        collection(firestore, 'players'),
        orderBy('name'),
        limit(100)
      );
      
      const querySnapshot = await getDocs(playersQuery);
      const playersData = [];
      
      querySnapshot.forEach((doc) => {
        if (user && doc.id === user.uid) return;
        const data = doc.data();
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

  const applyFilters = () => {
    if (!players.length) return;
    
    let result = [...players];
    
    // Basic filters
    if (location) {
      result = result.filter(player => {
        const playerLocation = player.location ? 
          `${player.location.city}, ${player.location.state}` : '';
        return playerLocation === location;
      });
    }

    if (skillLevel) {
      result = result.filter(player => player.skillLevel === skillLevel);
    }

    if (playingStyle) {
      result = result.filter(player => player.playingStyle === playingStyle);
    }

    if (availability) {
      result = result.filter(player => 
        Array.isArray(player.availability) && 
        player.availability.includes(availability)
      );
    }

    // Advanced filters
    if (playingHand) {
      result = result.filter(player => player.playingHand === playingHand);
    }

    if (gripStyle) {
      result = result.filter(player => player.gripStyle === gripStyle);
    }

    if (ratingRange.min > 0 || ratingRange.max < 3000) {
      result = result.filter(player => 
        player.rating >= ratingRange.min && player.rating <= ratingRange.max
      );
    }

    if (yearsPlaying) {
      const years = parseInt(yearsPlaying);
      result = result.filter(player => player.yearsPlaying >= years);
    }

    if (trainingPreference) {
      result = result.filter(player => 
        player.trainingPreferences && 
        player.trainingPreferences.includes(trainingPreference)
      );
    }

    if (tournament) {
      result = result.filter(player => 
        player.tournaments && 
        player.tournaments.includes(tournament)
      );
    }

    if (language) {
      result = result.filter(player => 
        player.languages && 
        player.languages.includes(language)
      );
    }

    if (equipment.brand) {
      result = result.filter(player => 
        player.equipment?.blade?.includes(equipment.brand) ||
        player.equipment?.forehandRubber?.includes(equipment.brand) ||
        player.equipment?.backhandRubber?.includes(equipment.brand)
      );
    }

    if (equipment.rubber) {
      result = result.filter(player => 
        player.equipment?.forehandRubber === equipment.rubber ||
        player.equipment?.backhandRubber === equipment.rubber
      );
    }

    setFilteredPlayers(result);
  };

  const handleMatchMySkill = () => {
    if (!user) {
      alert('Please log in to use this feature.');
      return;
    }
    
    if (!userProfile?.skillLevel) {
      alert('Please set your skill level in your profile first.');
      return;
    }

    setSkillLevel(userProfile.skillLevel);
    if (userProfile.location?.city) {
      const userLocation = `${userProfile.location.city}, ${userProfile.location.state || ''}`.trim();
      setLocation(userLocation);
    }
  };

  const handleReset = () => {
    setLocation('');
    setSkillLevel('');
    setPlayingStyle('');
    setAvailability('');
    setPlayingHand('');
    setGripStyle('');
    setRatingRange({ min: 0, max: 3000 });
    setYearsPlaying('');
    setTrainingPreference('');
    setTournament('');
    setLanguage('');
    setEquipment({ brand: '', rubber: '' });
  };

  return (
    <div className="find-players-container">
      <h2>Find Table Tennis Players</h2>
      
      <div className="filters-section">
        <form className="filter-form" onSubmit={(e) => e.preventDefault()}>
          {/* Basic Filters */}
          <div className="basic-filters">
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <select
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">Any Location</option>
                {availableLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="skill-level">
                Skill Level
                <button
                  type="button"
                  className="match-skill-button"
                  onClick={handleMatchMySkill}
                  disabled={!userProfile?.skillLevel}
                  title={!userProfile?.skillLevel ? "Set your skill level in profile first" : "Match your skill level"}
                >
                  Match My Level
                </button>
              </label>
              <select
                id="skill-level"
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
              >
                <option value="">Any Skill Level</option>
                {skillLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="playing-style">Playing Style</label>
              <select
                id="playing-style"
                value={playingStyle}
                onChange={(e) => setPlayingStyle(e.target.value)}
              >
                <option value="">Any Style</option>
                {playingStyles.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="availability">Availability</label>
              <select
                id="availability"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              >
                <option value="">Any Time</option>
                {availabilityOptions.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            className="toggle-advanced-filters"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            {showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
          </button>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="advanced-filters">
              <div className="form-group">
                <label htmlFor="playing-hand">Playing Hand</label>
                <select
                  id="playing-hand"
                  value={playingHand}
                  onChange={(e) => setPlayingHand(e.target.value)}
                >
                  <option value="">Any Hand</option>
                  {playingHands.map(hand => (
                    <option key={hand} value={hand}>{hand}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="grip-style">Grip Style</label>
                <select
                  id="grip-style"
                  value={gripStyle}
                  onChange={(e) => setGripStyle(e.target.value)}
                >
                  <option value="">Any Grip</option>
                  {gripStyles.map(grip => (
                    <option key={grip} value={grip}>{grip}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="rating-range">Rating Range</label>
                <div className="rating-range-inputs">
                  <input
                    type="number"
                    id="rating-min"
                    value={ratingRange.min}
                    onChange={(e) => setRatingRange({...ratingRange, min: parseInt(e.target.value) || 0})}
                    min="0"
                    max="3000"
                    placeholder="Min"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    id="rating-max"
                    value={ratingRange.max}
                    onChange={(e) => setRatingRange({...ratingRange, max: parseInt(e.target.value) || 3000})}
                    min="0"
                    max="3000"
                    placeholder="Max"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="years-playing">Minimum Years Playing</label>
                <input
                  type="number"
                  id="years-playing"
                  value={yearsPlaying}
                  onChange={(e) => setYearsPlaying(e.target.value)}
                  min="0"
                  placeholder="Any Experience"
                />
              </div>

              <div className="form-group">
                <label htmlFor="training-preference">Training Preference</label>
                <select
                  id="training-preference"
                  value={trainingPreference}
                  onChange={(e) => setTrainingPreference(e.target.value)}
                >
                  <option value="">Any Preference</option>
                  {trainingPreferences.map(pref => (
                    <option key={pref} value={pref}>{pref}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="tournament">Tournament Experience</label>
                <select
                  id="tournament"
                  value={tournament}
                  onChange={(e) => setTournament(e.target.value)}
                >
                  <option value="">Any Tournament</option>
                  {tournaments.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="language">Language</label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="">Any Language</option>
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              <div className="form-group equipment-group">
                <label>Equipment</label>
                <div className="equipment-inputs">
                  <select
                    value={equipment.brand}
                    onChange={(e) => setEquipment({...equipment, brand: e.target.value})}
                  >
                    <option value="">Any Brand</option>
                    {equipmentBrands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                  <select
                    value={equipment.rubber}
                    onChange={(e) => setEquipment({...equipment, rubber: e.target.value})}
                  >
                    <option value="">Any Rubber</option>
                    {rubberTypes.map(rubber => (
                      <option key={rubber} value={rubber}>{rubber}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="filter-buttons">
            <button type="button" className="reset-button" onClick={handleReset}>
              Reset Filters
            </button>
          </div>
        </form>
      </div>

      <div className="players-section">
        {loading ? (
          <div className="loading-spinner">Loading players...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : filteredPlayers.length === 0 ? (
          <div className="no-results">
            No players found matching your criteria. Try adjusting your filters.
          </div>
        ) : (
          <div className="players-grid">
            {filteredPlayers.map((player) => (
              <div className="player-card" key={player.id}>
                <div className="player-header">
                  <div className="player-avatar">
                    {player.name.charAt(0)}
                  </div>
                  <div className="player-info">
                    <h4>{player.name}</h4>
                    {player.location && (
                      <div className="player-location">
                        {player.location.city}, {player.location.state}
                      </div>
                    )}
                  </div>
                </div>

                <div className="player-details">
                  <div className="detail-item skill-level">
                    <div className="label">Skill Level:</div>
                    <div className={`skill-badge ${player.skillLevel?.toLowerCase()}`}>
                      {player.skillLevel} ({player.rating})
                    </div>
                  </div>

                  <div className="detail-grid">
                    {player.playingStyle && (
                      <div className="detail-item">
                        <div className="label">Style:</div>
                        <div>{player.playingStyle}</div>
                      </div>
                    )}

                    {player.playingHand && (
                      <div className="detail-item">
                        <div className="label">Hand:</div>
                        <div>{player.playingHand}</div>
                      </div>
                    )}

                    {player.gripStyle && (
                      <div className="detail-item">
                        <div className="label">Grip:</div>
                        <div>{player.gripStyle}</div>
                      </div>
                    )}

                    {player.yearsPlaying && (
                      <div className="detail-item">
                        <div className="label">Experience:</div>
                        <div>{player.yearsPlaying} years</div>
                      </div>
                    )}
                  </div>

                  {player.availability && Array.isArray(player.availability) && player.availability.length > 0 && (
                    <div className="detail-item">
                      <div className="label">Available:</div>
                      <div className="availability-tags">
                        {player.availability.map(time => (
                          <span key={time} className="tag">{time}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {player.equipment && (Object.values(player.equipment).some(v => v)) && (
                    <div className="detail-item equipment">
                      <div className="label">Equipment:</div>
                      <div className="equipment-details">
                        {player.equipment.blade && <div>Blade: {player.equipment.blade}</div>}
                        {player.equipment.forehandRubber && <div>FH: {player.equipment.forehandRubber}</div>}
                        {player.equipment.backhandRubber && <div>BH: {player.equipment.backhandRubber}</div>}
                      </div>
                    </div>
                  )}

                  {player.languages && Array.isArray(player.languages) && player.languages.length > 0 && (
                    <div className="detail-item">
                      <div className="label">Languages:</div>
                      <div className="language-tags">
                        {player.languages.map(lang => (
                          <span key={lang} className="tag">{lang}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="player-footer">
                  <button
                    className="connect-button"
                    onClick={() => handleConnect(player)}
                  >
                    Connect
                  </button>
                  <div className="last-active">
                    Active: {new Date(player.lastActive).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindPlayers;
