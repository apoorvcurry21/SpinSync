import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const FindTables = () => {
  const [tables, setTables] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    const fetchTables = async () => {
      try {
        let q = collection(db, "tables");
        if (selectedLocation) {
          q = query(q, where("location", "==", selectedLocation));
        }
        const snapshot = await getDocs(q);
        const tablesList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTables(tablesList);
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };
    fetchTables();
  }, [selectedLocation]);

  return (
    <div>
      <input type="text" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} placeholder="Enter location" />
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "400px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {tables
          .filter((table) => table.latitude && table.longitude)
          .map((table) => (
            <Marker key={table.id} position={[table.latitude, table.longitude]}>
              <Popup>
                <b>{table.name}</b> <br />
                {table.location} <br />
                Type: {table.type} <br />
                Fee: {table.fee}
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};

export default FindTables;
