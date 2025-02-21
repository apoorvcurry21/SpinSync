import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

const Profile = () => {
  const [userData, setUserData] = useState({ name: "", location: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!userData.name || !userData.location) return alert("Fields cannot be empty!");

    setSaving(true);
    const user = auth.currentUser;
    if (!user) return;

    try {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, userData);
      alert("Profile updated!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setSaving(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      
      {loading ? <p>Loading...</p> : (
        <>
          <label className="block mb-2">Name</label>
          <input 
            type="text" 
            name="name" 
            value={userData.name} 
            onChange={handleChange} 
            className="w-full p-2 border rounded mb-4"
          />

          <label className="block mb-2">Location</label>
          <input 
            type="text" 
            name="location" 
            value={userData.location} 
            onChange={handleChange} 
            className="w-full p-2 border rounded mb-4"
          />

          <button 
            onClick={handleSave} 
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </>
      )}
    </div>
  );
};

export default Profile;
