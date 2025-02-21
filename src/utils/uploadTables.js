const { db } = require("../firebaseConfig");
const { collection, addDoc } = require("firebase/firestore");

console.log("DB Instance:", db); // ✅ Check karo db initialize hua ya nahi

const tableLocations = [
  {
    name: "DLF Cyber Hub Table",
    address: "DLF CyberHub, Gurugram, Haryana",
    latitude: 28.4946,
    longitude: 77.0880,
  },
  {
    name: "Sector 62 Public Table",
    address: "Park, Sector 62, Gurugram, Haryana",
    latitude: 28.4629,
    longitude: 77.0830,
  },
];

const uploadTables = async () => {
  try {
    const tablesCollection = collection(db, "tables"); // ✅ Ye line error de rahi thi
    console.log("Collection Reference:", tablesCollection); // ✅ Debug ke liye
    for (const table of tableLocations) {
      await addDoc(tablesCollection, table);
      console.log(`Added table: ${table.name}`);
    }
  } catch (error) {
    console.error("Error adding table:", error);
  }
};

uploadTables();
