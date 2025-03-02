import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const addPlayersToFirestore = async () => {
  const players = [
    {
      name: "Amit Sharma",
      location: "Gurgaon, Sector 62, Gali No. 4",
      skillLevel: "Intermediate",
      availability: "Evening",
    },
    {
      name: "Rohan Verma",
      location: "Noida, Sector 18, Near Mall",
      skillLevel: "Advanced",
      availability: "Morning",
    },
    {
      name: "Neha Gupta",
      location: "Delhi, Karol Bagh, Street 5",
      skillLevel: "Beginner",
      availability: "Night",
    },
    {
      name: "Sandeep Yadav",
      location: "Mumbai, Andheri West, Near Infinity Mall",
      skillLevel: "Intermediate",
      availability: "Afternoon",
    },
    {
      name: "Priya Mehta",
      location: "Bangalore, Indiranagar, 100 Feet Road",
      skillLevel: "Advanced",
      availability: "Evening",
    },
  ];

  try {
    for (const player of players) {
      await addDoc(collection(db, "players"), player);
    }
    console.log("Players added successfully!");
  } catch (error) {
    console.error("Error adding players:", error);
  }
};


addPlayersToFirestore();
