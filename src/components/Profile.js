import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { useAuthState } from '../contexts/AuthContext';
import { firestore, auth } from '../firebaseConfig';
import "../styles/Profile.scss";

const Profile = () => {
  const [userData, setUserData] = useState({ 
    name: "", 
    location: "", 
    skillLevel: "Beginner", 
    availability: "Anytime" 
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!userData.name || !userData.location) {
      return alert("Name and location cannot be empty!");
    }

    setSaving(true);
    const user = auth.currentUser;
    if (!user) {
      setSaving(false);
      return alert("You must be logged in to save your profile");
    }

    try {
      const docRef = doc(firestore, "users", user.uid);
      // Create a player record in the players collection as well
      const playerData = {
        name: userData.name,
        location: userData.location,
        skillLevel: userData.skillLevel,
        availability: userData.availability,
        userId: user.uid,
        email: user.email
      };
      
      await setDoc(docRef, userData);
      
      // Also update or create the player record
      const playerRef = doc(firestore, "players", user.uid);
      await setDoc(playerRef, playerData);
      
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile: " + error.message);
    }
    setSaving(false);
  };

  const skillLevels = ["Beginner", "Intermediate", "Advanced", "Professional"];
  const availabilityOptions = ["Morning", "Afternoon", "Evening", "Night", "Weekends", "Anytime"];

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Your Player Profile</h2>
        
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <div className="profile-form">
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                name="name" 
                value={userData.name} 
                onChange={handleChange} 
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input 
                type="text" 
                name="location" 
                value={userData.location} 
                onChange={handleChange} 
                placeholder="Enter your city/neighborhood"
              />
            </div>

            <div className="form-group">
              <label>Skill Level</label>
              <select 
                name="skillLevel" 
                value={userData.skillLevel} 
                onChange={handleChange}
              >
                {skillLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Availability</label>
              <select 
                name="availability" 
                value={userData.availability} 
                onChange={handleChange}
              >
                {availabilityOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={handleSave} 
              className="save-button"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
