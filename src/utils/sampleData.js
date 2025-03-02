// Sample data generator for SpinSync app
import { collection, doc, writeBatch } from 'firebase/firestore';

// Major cities in India with their approximate coordinates
const indianCities = [
  { name: "Mumbai", state: "Maharashtra", lat: 19.0760, lng: 72.8777 },
  { name: "Delhi", state: "Delhi", lat: 28.7041, lng: 77.1025 },
  { name: "Bangalore", state: "Karnataka", lat: 12.9716, lng: 77.5946 },
  { name: "Hyderabad", state: "Telangana", lat: 17.3850, lng: 78.4867 },
  { name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707 },
  { name: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639 },
  { name: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567 },
  { name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lng: 72.5714 },
  { name: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873 },
  { name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
  { name: "Chandigarh", state: "Chandigarh", lat: 30.7333, lng: 76.7794 },
  { name: "Kochi", state: "Kerala", lat: 9.9312, lng: 76.2673 },
  { name: "Guwahati", state: "Assam", lat: 26.1445, lng: 91.7362 },
  { name: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lng: 77.4126 },
  { name: "Indore", state: "Madhya Pradesh", lat: 22.7196, lng: 75.8577 },
  { name: "Nagpur", state: "Maharashtra", lat: 21.1458, lng: 79.0882 },
  { name: "Patna", state: "Bihar", lat: 25.5941, lng: 85.1376 },
  { name: "Bhubaneswar", state: "Odisha", lat: 20.2961, lng: 85.8245 },
  { name: "Visakhapatnam", state: "Andhra Pradesh", lat: 17.6868, lng: 83.2185 },
  { name: "Surat", state: "Gujarat", lat: 21.1702, lng: 72.8311 },
  { name: "Coimbatore", state: "Tamil Nadu", lat: 11.0168, lng: 76.9558 },
  { name: "Trivandrum", state: "Kerala", lat: 8.5241, lng: 76.9366 },
  { name: "Dehradun", state: "Uttarakhand", lat: 30.3165, lng: 78.0322 },
  { name: "Shimla", state: "Himachal Pradesh", lat: 31.1048, lng: 77.1734 },
  { name: "Raipur", state: "Chhattisgarh", lat: 21.2514, lng: 81.6296 }
];

// Venue types for table tennis tables
const venueTypes = [
  "Sports Club",
  "Community Center",
  "School/College",
  "Stadium",
  "Fitness Center",
  "Recreation Center",
  "Hotel",
  "Private Club",
  "Public Park",
  "Mall",
  "Corporate Office"
];

// Surface types for table tennis tables
const surfaceTypes = [
  "ITTF Approved",
  "Standard Indoor",
  "Outdoor Concrete",
  "Recreational Grade",
  "Professional Grade",
  "Conversion Top"
];

// Facility features
const facilityFeatures = [
  "Free Parking",
  "Changing Rooms",
  "Coaching Available",
  "Equipment Rental",
  "Refreshments",
  "Air Conditioning",
  "Spectator Seating",
  "Accessible",
  "WiFi",
  "Pro Shop",
  "Tournament Grade Lighting"
];

// Table names/models
const tableModels = [
  "Stiga Expert Roller",
  "Butterfly Centrefold 25",
  "Joola Inside",
  "Donic Waldner Classic 25",
  "Cornilleau 500M Crossover",
  "Stiga Premium Compact",
  "Butterfly Octet 25",
  "DHS T1223",
  "Kettler Outdoor 10",
  "Double Happiness 1800"
];

// Random venue names
const venueNamePrefixes = [
  "Golden", "Premier", "Royal", "Elite", "Champion", "Victory", "National", "City", 
  "Star", "Olympic", "Pro", "Master", "Grand", "Universal", "Supreme", "Urban", 
  "Global", "Metro", "Imperial", "Diamond"
];

const venueNameSuffixes = [
  "Sports Club", "Indoor Stadium", "Table Tennis Academy", "TT Center", "Sports Arena", 
  "Recreation Club", "Sports Complex", "Ping Pong Club", "Sports Hub", "TT Association", 
  "Training Center", "Sports Zone", "Athletic Club", "Sports Society", "Play Arena"
];

// Available hours
const openingHours = [
  "06:00 AM - 10:00 PM",
  "08:00 AM - 09:00 PM",
  "09:00 AM - 11:00 PM",
  "10:00 AM - 08:00 PM",
  "07:00 AM - 10:00 PM",
  "08:00 AM - 11:00 PM",
  "24 Hours"
];

// Ratings
const ratings = [3, 3.5, 4, 4.5, 5];

// Contact details
const phoneNumbers = ["+91 9876543210", "+91 8765432109", "+91 7654321098", "+91 6543210987"];
const emails = ["info@venue.com", "contact@ttvenue.com", "bookings@sportsclub.com", "play@ttcenter.com"];

// Accessibility options
const accessibilityOptions = ["Public", "Members Only", "Pay-and-Play", "Booking Required"];

// Cost ranges
const costRanges = [
  "₹100 - ₹200 per hour",
  "₹150 - ₹300 per hour",
  "₹200 - ₹400 per hour",
  "₹300 - ₹500 per hour",
  "₹500+ per hour",
  "Free for members",
  "₹50 per person"
];

// -------------------- Player Data --------------------

// Player names
const firstNames = [
  "Aditya", "Rahul", "Priya", "Neha", "Arjun", "Ananya", "Rohan", "Nisha", "Vikram", 
  "Anjali", "Karan", "Meera", "Ravi", "Pooja", "Amit", "Sneha", "Suresh", "Kavita", 
  "Raj", "Divya", "Vijay", "Aishwarya", "Sanjay", "Deepika", "Rajesh", "Mira",
  "Aarav", "Ishaan", "Zara", "Kabir", "Saanvi", "Advait", "Myra", "Reyansh", "Aanya",
  "Aryan", "Anaya", "Vihaan", "Amaira", "Ayush", "Navya", "Dhruv", "Aadhya", "Dev", 
  "Pari", "Gautam", "Riya", "Krishna", "Kyra", "Mohit", "Diya", "Sahil", "Trisha"
];

const lastNames = [
  "Sharma", "Patel", "Singh", "Kumar", "Gupta", "Mishra", "Desai", "Shah", "Verma", 
  "Joshi", "Mehta", "Chatterjee", "Nair", "Reddy", "Mukherjee", "Iyer", "Bose", "Das", 
  "Banerjee", "Kapoor", "Malhotra", "Bhatia", "Rao", "Nayar", "Pillai", "Chowdhury",
  "Agarwal", "Khanna", "Mehra", "Kulkarni", "Subramaniam", "Tiwari", "Yadav", "Chopra",
  "Dutta", "Chauhan", "Thakur", "Goswami", "Kaur", "Chakraborty", "Bhatt", "Menon",
  "Wadhwa", "Prasad", "Arora", "Trivedi", "Seshadri", "Bajaj", "Shenoy", "Gokhale"
];

// Skill levels
const skillLevels = ["Beginner", "Intermediate", "Advanced", "Professional"];

// Playing styles
const playingStyles = [
  "Offensive", "Defensive", "All-Round", "Aggressive", "Counter-Attack", 
  "Chopper", "Blocker", "Power Hitter", "Looper", "Technical"
];

// Availability
const availabilityOptions = [
  "Weekday Evenings", "Weekend Mornings", "Weekend Afternoons", 
  "Weekday Mornings", "Anytime", "Weekday Afternoons"
];

// Utility functions
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const getRandomSubarray = (arr, size) => {
  const shuffled = arr.slice(0);
  let i = arr.length;
  const min = i - size;
  while (i-- > min) {
    const index = Math.floor((i + 1) * Math.random());
    const temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
};

// Generate a random offset for coordinates to spread tables within cities
const getRandomCoordOffset = () => {
  return (Math.random() - 0.5) * 0.05; // +/- 0.025 degrees (roughly 2-3 km)
};

// Generate a venue name
const generateVenueName = () => {
  return `${getRandomElement(venueNamePrefixes)} ${getRandomElement(venueNameSuffixes)}`;
};

// Generate sample data for tables
export const generateTableData = (count = 100) => {
  const tables = [];
  
  for (let i = 0; i < count; i++) {
    const cityInfo = getRandomElement(indianCities);
    const venueName = generateVenueName();
    const venueType = getRandomElement(venueTypes);
    const featuresCount = getRandomInt(2, 6);
    const features = getRandomSubarray(facilityFeatures, featuresCount);
    const numTables = getRandomInt(1, 8);
    const tableModel = getRandomElement(tableModels);
    const surface = getRandomElement(surfaceTypes);
    
    // Add a small random offset to the coordinates to spread tables within a city
    const latOffset = getRandomCoordOffset();
    const lngOffset = getRandomCoordOffset();
    
    tables.push({
      id: `table-${i + 1}`,
      name: venueName,
      location: {
        address: `${getRandomInt(1, 999)}, ${getRandomElement(['Main Road', 'Street', 'Avenue', 'Lane', 'Cross'])}`,
        city: cityInfo.name,
        state: cityInfo.state,
        coordinates: {
          lat: cityInfo.lat + latOffset,
          lng: cityInfo.lng + lngOffset
        }
      },
      venueType: venueType,
      numTables: numTables,
      tableModel: tableModel,
      surface: surface,
      features: features,
      hours: getRandomElement(openingHours),
      cost: getRandomElement(costRanges),
      rating: getRandomElement(ratings),
      contact: {
        phone: getRandomElement(phoneNumbers),
        email: getRandomElement(emails),
        website: Math.random() > 0.5 ? `http://www.${venueName.toLowerCase().replace(/\s/g, '')}.com` : null
      },
      accessibility: getRandomElement(accessibilityOptions),
      verified: Math.random() > 0.3, // 70% chance of being verified
      images: [], // This would contain URLs to images
      createdAt: new Date().toISOString()
    });
  }
  
  return tables;
};

// Generate sample player data
export const generatePlayerData = (count = 50) => {
  const players = [];
  
  for (let i = 0; i < count; i++) {
    const cityInfo = getRandomElement(indianCities);
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const skillLevel = getRandomElement(skillLevels);
    const playingStyle = getRandomElement(playingStyles);
    const availabilityCount = getRandomInt(1, 3);
    const availability = getRandomSubarray(availabilityOptions, availabilityCount);
    
    players.push({
      id: `player-${i + 1}`,
      name: `${firstName} ${lastName}`,
      location: {
        city: cityInfo.name,
        state: cityInfo.state
      },
      skillLevel: skillLevel,
      playingStyle: playingStyle,
      availability: availability,
      bio: `Table tennis enthusiast from ${cityInfo.name}. ${skillLevel} player with a ${playingStyle.toLowerCase()} style.`,
      yearsPlaying: getRandomInt(1, 15),
      equipment: Math.random() > 0.3 ? `${getRandomElement(['Butterfly', 'Stiga', 'Donic', 'Joola', 'Yasaka'])} ${getRandomElement(['blade', 'racket'])}` : null,
      lookingForMatch: Math.random() > 0.2, // 80% chance of looking for a match
      profileCompleted: Math.random() > 0.1, // 90% chance of having a completed profile
      createdAt: new Date().toISOString()
    });
  }
  
  return players;
};

// Export a function to add the sample data to Firebase
export const addSampleDataToFirebase = async (firestore) => {
  const tables = generateTableData(100);
  const players = generatePlayerData(50);
  
  try {
    // Handle batch size limit (500 operations per batch)
    const batchSize = 450; // Keep it under 500 to be safe
    
    // Write tables in batches
    let currentBatch = writeBatch(firestore);
    let operationCount = 0;
    
    console.log(`Adding ${tables.length} tables to Firestore...`);
    
    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];
      const tableRef = doc(collection(firestore, 'tables'), table.id);
      currentBatch.set(tableRef, table);
      operationCount++;
      
      // If we've reached the batch limit, commit and create a new batch
      if (operationCount === batchSize) {
        await currentBatch.commit();
        console.log(`Committed batch of ${operationCount} table operations`);
        currentBatch = writeBatch(firestore);
        operationCount = 0;
      }
    }
    
    // Commit any remaining table operations
    if (operationCount > 0) {
      await currentBatch.commit();
      console.log(`Committed final batch of ${operationCount} table operations`);
    }
    
    console.log('Sample table data added successfully');
    
    // Reset for player data
    currentBatch = writeBatch(firestore);
    operationCount = 0;
    
    console.log(`Adding ${players.length} players to Firestore...`);
    
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      const userRef = doc(collection(firestore, 'users'), player.id);
      currentBatch.set(userRef, player);
      operationCount++;
      
      // If we've reached the batch limit, commit and create a new batch
      if (operationCount === batchSize) {
        await currentBatch.commit();
        console.log(`Committed batch of ${operationCount} player operations`);
        currentBatch = writeBatch(firestore);
        operationCount = 0;
      }
    }
    
    // Commit any remaining player operations
    if (operationCount > 0) {
      await currentBatch.commit();
      console.log(`Committed final batch of ${operationCount} player operations`);
    }
    
    console.log('Sample player data added successfully');
    
    return { 
      success: true, 
      message: 'Sample data added successfully', 
      tableCount: tables.length, 
      playerCount: players.length 
    };
  } catch (error) {
    console.error('Error adding sample data:', error);
    return { success: false, error: error.message };
  }
}; 