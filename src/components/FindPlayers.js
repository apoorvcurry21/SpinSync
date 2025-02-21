import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";

const FindPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [location, setLocation] = useState("");
  
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        let q = collection(db, "players");
        if (location.trim() !== "") {
          q = query(q, where("location", "==", location.trim()));
        }
        const snapshot = await getDocs(q);
        const playersList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPlayers(playersList);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };
    fetchPlayers();
  }, [location]);

  return (
    <div>
      <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter location" />
      <ul>
        {players.map((player) => (
          <li key={player.id}>{player.name} - {player.location}</li>
        ))}
      </ul>
    </div>
  );
};

export default FindPlayers;
