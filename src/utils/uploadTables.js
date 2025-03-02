import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const tableLocations = [
  { name: "DLF Cyber Hub Table", address: "DLF CyberHub, Gurugram, Haryana", latitude: 28.4946, longitude: 77.0880 },
  { name: "Sector 62 Public Table", address: "Park, Sector 62, Gurugram, Haryana", latitude: 28.4629, longitude: 77.0830 }
];

export const uploadTables = async () => {
  try {
    const tablesCollection = collection(db, "tables");
    for (const table of tableLocations) {
      await addDoc(tablesCollection, table);
      console.log(`Added table: ${table.name}`);
    }
  } catch (error) {
    console.error("Error adding tables:", error);
  }
};