import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon, latLng } from 'leaflet';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import { useAuthState } from '../contexts/AuthContext';
import 'leaflet/dist/leaflet.css';
import '../styles/FindTables.scss';

// Custom marker icon
const tableIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const FindTables = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tables, setTables] = useState([]);
  const [filteredTables, setFilteredTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Center of India
  const [zoom, setZoom] = useState(5);
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef();

  // Fetch tables on component mount
  useEffect(() => {
    fetchTables();
  }, []);

  // Fetch tables from Firebase
  const fetchTables = async () => {
    setLoading(true);
    try {
      const tablesQuery = query(
        collection(firestore, 'tables'),
        orderBy('createdAt', 'desc'),
        limit(100)
      );
      
      const querySnapshot = await getDocs(tablesQuery);
      const tablesData = [];
      
      querySnapshot.forEach((doc) => {
        tablesData.push({ id: doc.id, ...doc.data() });
      });
      
      setTables(tablesData);
      setFilteredTables(tablesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching tables:', err);
      setError('Failed to load tables. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Filter tables based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTables(tables);
      return;
    }
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = tables.filter(table => {
      return (
        table.name.toLowerCase().includes(lowerCaseQuery) ||
        table.location.city.toLowerCase().includes(lowerCaseQuery) ||
        table.location.state.toLowerCase().includes(lowerCaseQuery) ||
        (table.venueType && table.venueType.toLowerCase().includes(lowerCaseQuery))
      );
    });
    
    setFilteredTables(filtered);
  }, [searchQuery, tables]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // If a specific city is searched, try to center the map there
    const cityMatch = tables.find(table => 
      table.location.city.toLowerCase() === searchQuery.toLowerCase() ||
      table.location.state.toLowerCase() === searchQuery.toLowerCase()
    );
    
    if (cityMatch && cityMatch.location.coordinates) {
      setMapCenter([cityMatch.location.coordinates.lat, cityMatch.location.coordinates.lng]);
      setZoom(12);
    }
  };

  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setMapCenter([latitude, longitude]);
          setZoom(12);
          
          // Find tables near user's location
          if (tables.length > 0) {
            const nearbyTables = findNearbyTables(latitude, longitude);
            setFilteredTables(nearbyTables);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to retrieve your location. Please make sure location services are enabled.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Find tables near a specific location
  const findNearbyTables = (lat, lng, radiusInKm = 25) => {
    return tables.filter(table => {
      if (!table.location.coordinates) return false;
      
      const distance = calculateDistance(
        lat, 
        lng, 
        table.location.coordinates.lat, 
        table.location.coordinates.lng
      );
      
      return distance <= radiusInKm;
    }).sort((a, b) => {
      const distanceA = calculateDistance(
        lat, 
        lng, 
        a.location.coordinates.lat, 
        a.location.coordinates.lng
      );
      const distanceB = calculateDistance(
        lat, 
        lng, 
        b.location.coordinates.lat, 
        b.location.coordinates.lng
      );
      return distanceA - distanceB;
    });
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Distance in km
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };

  // Center map on a specific table
  const centerMapOnTable = (table) => {
    if (table.location.coordinates) {
      setMapCenter([table.location.coordinates.lat, table.location.coordinates.lng]);
      setZoom(15);
      setSelectedTable(table);
    }
  };

  return (
    <div className="find-tables-container">
      <h2>Find Table Tennis Tables</h2>
      
      <div className="search-container">
        <form className="search-box" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by city, venue name, or state"
          />
          <button 
            type="button" 
            className="location-button"
            onClick={getUserLocation}
            title="Use my current location"
          >
            Use My Location
          </button>
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>
      
      {loading ? (
        <div className="loading-spinner">Loading tables...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="map-container">
            <MapContainer
              center={mapCenter}
              zoom={zoom}
              style={{ height: '400px', width: '100%' }}
              ref={mapRef}
              whenCreated={(map) => (mapRef.current = map)}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {userLocation && (
                <Marker 
                  position={[userLocation.lat, userLocation.lng]}
                  icon={new Icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                  })}
                >
                  <Popup>Your Location</Popup>
                </Marker>
              )}
              
              {filteredTables.map((table) => (
                table.location.coordinates && (
                  <Marker 
                    key={table.id}
                    position={[table.location.coordinates.lat, table.location.coordinates.lng]}
                    icon={tableIcon}
                    eventHandlers={{
                      click: () => {
                        setSelectedTable(table);
                      },
                    }}
                  >
                    <Popup>
                      <div className="popup-content">
                        <h3>{table.name}</h3>
                        <p>{table.location.address}, {table.location.city}</p>
                        <p>Type: {table.venueType}</p>
                        <p>Tables: {table.numTables}</p>
                        {table.cost && <p>Cost: {table.cost}</p>}
                      </div>
                    </Popup>
                  </Marker>
                )
              ))}
            </MapContainer>
          </div>
          
          <div className="tables-list">
            <h3>Available Tables {userLocation ? 'Near You' : ''}</h3>
            
            {filteredTables.length === 0 ? (
              <div className="no-results">No tables found. Try broadening your search.</div>
            ) : (
              <div className="tables-grid">
                {filteredTables.map((table) => (
                  <div className="table-card" key={table.id}>
                    <h4>{table.name}</h4>
                    <p><span>Address:</span> {table.location.address}, {table.location.city}, {table.location.state}</p>
                    <p><span>Venue Type:</span> {table.venueType}</p>
                    <p><span>Number of Tables:</span> {table.numTables}</p>
                    <p><span>Surface:</span> {table.surface}</p>
                    {table.hours && <p><span>Hours:</span> {table.hours}</p>}
                    {table.cost && <p><span>Cost:</span> {table.cost}</p>}
                    {table.features && (
                      <p>
                        <span>Features:</span> {table.features.join(', ')}
                      </p>
                    )}
                    <button
                      className="view-map-button"
                      onClick={() => {
                        centerMapOnTable(table);
                        if (mapRef.current) {
                          mapRef.current.setView(
                            [table.location.coordinates.lat, table.location.coordinates.lng],
                            15
                          );
                        }
                      }}
                    >
                      View on Map
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FindTables;
