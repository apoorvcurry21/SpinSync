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
export const skillLevels = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Professional"
];

// Playing styles
export const playingStyles = [
  "Offensive", "Defensive", "All-Round", "Aggressive", "Counter-Attack", 
  "Chopper", "Blocker", "Power Hitter", "Looper", "Technical"
];

// Availability
export const availabilityOptions = [
  "Weekday Evenings", "Weekend Mornings", "Weekend Afternoons", 
  "Weekday Mornings", "Anytime", "Weekday Afternoons"
];

// Additional player attributes
export const playingHands = ["Right-Handed", "Left-Handed", "Ambidextrous"];

const gripStyles = ["Shakehand", "Penhold", "Seemiller"];

const trainingPreferences = [
  "Practice Partner",
  "Competitive Matches",
  "Casual Games",
  "Tournament Preparation",
  "Technique Training",
  "Coaching Sessions"
];

const tournaments = [
  "Local Leagues",
  "State Championships",
  "National Tournaments",
  "Club Competitions",
  "Corporate Tournaments",
  "Regional Championships"
];

const rankings = {
  Beginner: [800, 1200],
  Intermediate: [1200, 1800],
  Advanced: [1800, 2200],
  Professional: [2200, 2800]
};

export const languages = [
  "English", "Spanish", "French", "German", "Chinese", "Japanese", 
  "Korean", "Russian", "Portuguese", "Italian"
];

const equipmentBrands = [
  "Butterfly",
  "Stiga",
  "DHS",
  "Donic",
  "Joola",
  "Yasaka",
  "Tibhar",
  "Xiom",
  "Nittaku"
];

const rubberTypes = [
  "Tenergy 05",
  "Hurricane 3",
  "Rakza 7",
  "Evolution MX-P",
  "Fastarc G-1",
  "Mark V",
  "Dignics 09C",
  "Rasanter R47"
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

// Generate sample player data with enhanced attributes
export const generatePlayerData = (count = 100) => {
  const players = [];
  
  for (let i = 0; i < count; i++) {
    const cityInfo = getRandomElement(indianCities);
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const skillLevel = getRandomElement(skillLevels);
    const playingStyle = getRandomElement(playingStyles);
    const availabilityCount = getRandomInt(1, 4);
    const availability = getRandomSubarray(availabilityOptions, availabilityCount);
    const trainingPrefsCount = getRandomInt(1, 3);
    const tournamentCount = getRandomInt(0, 3);
    const languagesCount = getRandomInt(1, 3);
    
    // Calculate rating based on skill level
    const [minRating, maxRating] = rankings[skillLevel];
    const rating = getRandomInt(minRating, maxRating);
    
    players.push({
      id: `player-${i + 1}`,
      name: `${firstName} ${lastName}`,
      location: {
        city: cityInfo.name,
        state: cityInfo.state
      },
      skillLevel: skillLevel,
      rating: rating,
      playingStyle: playingStyle,
      playingHand: getRandomElement(playingHands),
      gripStyle: getRandomElement(gripStyles),
      availability: availability,
      trainingPreferences: getRandomSubarray(trainingPreferences, trainingPrefsCount),
      tournaments: getRandomSubarray(tournaments, tournamentCount),
      languages: getRandomSubarray(languages, languagesCount),
      bio: `Table tennis enthusiast from ${cityInfo.name}. ${skillLevel} player with a ${playingStyle.toLowerCase()} style.`,
      yearsPlaying: getRandomInt(1, 20),
      equipment: {
        blade: Math.random() > 0.2 ? `${getRandomElement(equipmentBrands)} ${getRandomElement(['blade', 'racket'])}` : null,
        forehandRubber: Math.random() > 0.2 ? getRandomElement(rubberTypes) : null,
        backhandRubber: Math.random() > 0.2 ? getRandomElement(rubberTypes) : null
      },
      achievements: Math.random() > 0.7 ? [
        `${getRandomElement(['Winner', 'Runner-up', 'Semi-finalist'])} - ${getRandomElement(tournaments)} ${getRandomInt(2020, 2025)}`
      ] : [],
      coachingExperience: Math.random() > 0.8 ? getRandomInt(1, 10) : 0,
      lookingForMatch: Math.random() > 0.2,
      profileCompleted: Math.random() > 0.1,
      memberSince: new Date(Date.now() - getRandomInt(0, 730) * 24 * 60 * 60 * 1000).toISOString(),
      lastActive: new Date(Date.now() - getRandomInt(0, 30) * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString()
    });
  }
  
  return players;
};

// Utility function to delay execution (for rate limiting)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Rate-limited batch commit function
const commitBatchWithRetry = async (batch, attemptNumber = 1) => {
  const maxAttempts = 3;
  const baseDelay = 1000; // 1 second

  try {
    await batch.commit();
  } catch (error) {
    if (attemptNumber < maxAttempts && error.code === 'resource-exhausted') {
      const delayTime = baseDelay * Math.pow(2, attemptNumber - 1);
      console.log(`Rate limit hit, retrying in ${delayTime}ms...`);
      await delay(delayTime);
      return commitBatchWithRetry(batch, attemptNumber + 1);
    }
    throw error;
  }
};

export const addSampleDataToFirebase = async (firestore) => {
  const tables = generateTableData(50); // Reduced to 50 for better performance
  const players = generatePlayerData(25); // Reduced to 25 for better performance
  
  try {
    const batchSize = 450;
    let operationsCompleted = 0;
    let tablesAdded = 0;
    let playersAdded = 0;
    
    // Add tables
    console.log('Adding tables to Firestore...');
    for (let i = 0; i < tables.length; i += batchSize) {
      const batch = writeBatch(firestore);
      const chunk = tables.slice(i, i + batchSize);
      
      chunk.forEach(table => {
        const tableRef = doc(collection(firestore, 'tables'));
        batch.set(tableRef, {
          ...table,
          id: tableRef.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      });

      try {
        await commitBatchWithRetry(batch);
        operationsCompleted += chunk.length;
        tablesAdded += chunk.length;
        console.log(`Progress: ${operationsCompleted}/${tables.length + players.length} operations completed`);
        
        // Add a small delay between batches to prevent rate limiting
        await delay(500);
      } catch (error) {
        console.error('Error in table batch:', error);
        throw error;
      }
    }

    // Add players
    console.log('Adding players to Firestore...');
    for (let i = 0; i < players.length; i += batchSize) {
      const batch = writeBatch(firestore);
      const chunk = players.slice(i, i + batchSize);
      
      chunk.forEach(player => {
        const playerRef = doc(collection(firestore, 'players'));
        batch.set(playerRef, {
          ...player,
          id: playerRef.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      });

      try {
        await commitBatchWithRetry(batch);
        operationsCompleted += chunk.length;
        playersAdded += chunk.length;
        console.log(`Progress: ${operationsCompleted}/${tables.length + players.length} operations completed`);
        
        // Add a small delay between batches to prevent rate limiting
        await delay(500);
      } catch (error) {
        console.error('Error in player batch:', error);
        throw error;
      }
    }

    console.log('Sample data initialization completed successfully');
    return { 
      success: true, 
      message: 'Sample data added successfully', 
      tableCount: tablesAdded, 
      playerCount: playersAdded 
    };
  } catch (error) {
    console.error('Error adding sample data:', error);
    return { 
      success: false, 
      error: error.message,
      tablesAdded,
      playersAdded
    };
  }
};

export const samplePlayers = [
  {
    id: "p1",
    name: "Raj Kumar",
    location: { city: "Mumbai", state: "Maharashtra" },
    skillLevel: "Advanced",
    rating: 2100,
    playingStyle: "Offensive",
    playingHand: "Right-Handed",
    gripStyle: "Shakehand",
    yearsPlaying: 8,
    availability: ["Weekday Evenings", "Weekend Mornings"],
    trainingPreferences: ["Competitive Matches", "Tournament Preparation"],
    tournaments: ["State Championships", "National Tournaments"],
    languages: ["English", "Hindi", "Marathi"],
    equipment: {
      blade: "Butterfly Viscaria",
      forehandRubber: "Tenergy 05",
      backhandRubber: "Tenergy 05"
    },
    lastActive: "2025-04-08"
  },
  {
    id: "p2",
    name: "Sarah Chen",
    location: { city: "Bengaluru", state: "Karnataka" },
    skillLevel: "Professional",
    rating: 2450,
    playingStyle: "All-Round",
    playingHand: "Right-Handed",
    gripStyle: "Penhold",
    yearsPlaying: 15,
    availability: ["Weekday Mornings", "Weekend Evenings"],
    trainingPreferences: ["Coaching Sessions", "Tournament Preparation"],
    tournaments: ["National Tournaments", "International Open"],
    languages: ["English", "Mandarin", "Kannada"],
    equipment: {
      blade: "DHS Hurricane Long 5",
      forehandRubber: "Hurricane 3",
      backhandRubber: "Hurricane 3 Neo"
    },
    lastActive: "2025-04-08"
  },
  {
    id: "p3",
    name: "Priya Sharma",
    location: { city: "Delhi", state: "Delhi" },
    skillLevel: "Intermediate",
    rating: 1750,
    playingStyle: "Defensive",
    playingHand: "Right-Handed",
    gripStyle: "Shakehand",
    yearsPlaying: 4,
    availability: ["Weekend Afternoons", "Weekend Evenings"],
    trainingPreferences: ["Practice Partner", "Technique Training"],
    tournaments: ["Local Leagues", "State Championships"],
    languages: ["English", "Hindi"],
    equipment: {
      blade: "Stiga Infinity VPS V",
      forehandRubber: "Rakza 7",
      backhandRubber: "Rakza 7"
    },
    lastActive: "2025-04-07"
  },
  {
    id: "p4",
    name: "Mike Anderson",
    location: { city: "Chennai", state: "Tamil Nadu" },
    skillLevel: "Beginner",
    rating: 1200,
    playingStyle: "Aggressive",
    playingHand: "Right-Handed",
    gripStyle: "Shakehand",
    yearsPlaying: 1,
    availability: ["Weekday Evenings"],
    trainingPreferences: ["Casual Games", "Technique Training"],
    tournaments: ["Club Competitions"],
    languages: ["English", "Tamil"],
    equipment: {
      blade: "Yasaka Sweden Extra",
      forehandRubber: "Mark V",
      backhandRubber: "Mark V"
    },
    lastActive: "2025-04-08"
  },
  {
    id: "p5",
    name: "Arun Patel",
    location: { city: "Ahmedabad", state: "Gujarat" },
    skillLevel: "Advanced",
    rating: 2000,
    playingStyle: "Looper",
    playingHand: "Left-Handed",
    gripStyle: "Shakehand",
    yearsPlaying: 10,
    availability: ["Weekday Mornings", "Weekend Mornings"],
    trainingPreferences: ["Competitive Matches", "Coaching Sessions"],
    tournaments: ["State Championships", "Corporate Tournaments"],
    languages: ["English", "Hindi", "Gujarati"],
    equipment: {
      blade: "Butterfly Timo Boll ALC",
      forehandRubber: "Dignics 09C",
      backhandRubber: "Dignics 05"
    },
    lastActive: "2025-04-08"
  },
  {
    id: "p6",
    name: "Lin Wei",
    location: { city: "Mumbai", state: "Maharashtra" },
    skillLevel: "Professional",
    rating: 2600,
    playingStyle: "Offensive",
    playingHand: "Right-Handed",
    gripStyle: "Penhold",
    yearsPlaying: 20,
    availability: ["Weekday Afternoons", "Weekend Afternoons"],
    trainingPreferences: ["Tournament Preparation", "Coaching Sessions"],
    tournaments: ["National Tournaments", "International Open"],
    languages: ["English", "Mandarin", "Hindi"],
    equipment: {
      blade: "DHS Hurricane Long 5X",
      forehandRubber: "Hurricane 3 Neo",
      backhandRubber: "Hurricane 3 Neo"
    },
    lastActive: "2025-04-07"
  },
  {
    id: "p7",
    name: "Kavya Menon",
    location: { city: "Kochi", state: "Kerala" },
    skillLevel: "Intermediate",
    rating: 1600,
    playingStyle: "Counter-Attack",
    playingHand: "Right-Handed",
    gripStyle: "Shakehand",
    yearsPlaying: 3,
    availability: ["Weekend Mornings", "Weekend Evenings"],
    trainingPreferences: ["Practice Partner", "Casual Games"],
    tournaments: ["Local Leagues"],
    languages: ["English", "Malayalam", "Hindi"],
    equipment: {
      blade: "Xiom Vega Pro",
      forehandRubber: "Vega Europe",
      backhandRubber: "Vega Europe"
    },
    lastActive: "2025-04-08"
  },
  {
    id: "p8",
    name: "David Kim",
    location: { city: "Bengaluru", state: "Karnataka" },
    skillLevel: "Advanced",
    rating: 2200,
    playingStyle: "Power Hitter",
    playingHand: "Right-Handed",
    gripStyle: "Shakehand",
    yearsPlaying: 12,
    availability: ["Weekday Evenings", "Weekend Evenings"],
    trainingPreferences: ["Competitive Matches", "Tournament Preparation"],
    tournaments: ["State Championships", "National Tournaments"],
    languages: ["English", "Korean", "Kannada"],
    equipment: {
      blade: "Butterfly Zhang Jike Super ZLC",
      forehandRubber: "Tenergy 64",
      backhandRubber: "Tenergy 05"
    },
    lastActive: "2025-04-08"
  },
  {
    id: "p9",
    name: "Maya Desai",
    location: { city: "Pune", state: "Maharashtra" },
    skillLevel: "Beginner",
    rating: 1100,
    playingStyle: "All-Round",
    playingHand: "Right-Handed",
    gripStyle: "Shakehand",
    yearsPlaying: 1,
    availability: ["Weekday Mornings", "Weekend Mornings"],
    trainingPreferences: ["Technique Training", "Casual Games"],
    tournaments: ["Club Competitions"],
    languages: ["English", "Hindi", "Marathi"],
    equipment: {
      blade: "Stiga Classic",
      forehandRubber: "Mark V",
      backhandRubber: "Mark V"
    },
    lastActive: "2025-04-07"
  },
  {
    id: "p10",
    name: "Zhao Ming",
    location: { city: "Delhi", state: "Delhi" },
    skillLevel: "Professional",
    rating: 2500,
    playingStyle: "Offensive",
    playingHand: "Left-Handed",
    gripStyle: "Penhold",
    yearsPlaying: 18,
    availability: ["Weekday Afternoons", "Weekend Afternoons"],
    trainingPreferences: ["Tournament Preparation", "Coaching Sessions"],
    tournaments: ["National Tournaments", "International Open"],
    languages: ["English", "Mandarin", "Hindi"],
    equipment: {
      blade: "Butterfly Harimoto Tomokazu ALC",
      forehandRubber: "Dignics 09C",
      backhandRubber: "Dignics 05"
    },
    lastActive: "2025-04-08"
  },
  {
    id: "p11",
    name: "Arjun Reddy",
    location: { city: "Hyderabad", state: "Telangana" },
    skillLevel: "Advanced",
    rating: 2150,
    playingStyle: "Looper",
    playingHand: "Right-Handed",
    gripStyle: "Shakehand",
    yearsPlaying: 9,
    availability: ["Weekday Evenings", "Weekend Mornings"],
    trainingPreferences: ["Competitive Matches", "Tournament Preparation"],
    tournaments: ["State Championships", "Corporate Tournaments"],
    languages: ["English", "Hindi", "Telugu"],
    equipment: {
      blade: "Butterfly Viscaria",
      forehandRubber: "Tenergy 05",
      backhandRubber: "Tenergy 05"
    },
    lastActive: "2025-04-08"
  },
  {
    id: "p12",
    name: "Emma Wilson",
    location: { city: "Bengaluru", state: "Karnataka" },
    skillLevel: "Intermediate",
    rating: 1800,
    playingStyle: "Technical",
    playingHand: "Right-Handed",
    gripStyle: "Seemiller",
    yearsPlaying: 5,
    availability: ["Weekend Mornings", "Weekend Afternoons"],
    trainingPreferences: ["Practice Partner", "Technique Training"],
    tournaments: ["Local Leagues", "Club Competitions"],
    languages: ["English", "Kannada"],
    equipment: {
      blade: "Donic Waldner Senso Carbon",
      forehandRubber: "Evolution MX-P",
      backhandRubber: "Evolution MX-P"
    },
    lastActive: "2025-04-07"
  },
  {
    id: "p13",
    name: "Rajesh Verma",
    location: { city: "Lucknow", state: "Uttar Pradesh" },
    skillLevel: "Beginner",
    rating: 1300,
    playingStyle: "Defensive",
    playingHand: "Right-Handed",
    gripStyle: "Shakehand",
    yearsPlaying: 2,
    availability: ["Weekday Evenings", "Weekend Evenings"],
    trainingPreferences: ["Casual Games", "Technique Training"],
    tournaments: ["Club Competitions"],
    languages: ["English", "Hindi"],
    equipment: {
      blade: "Stiga Allround Classic",
      forehandRubber: "Rakza 7",
      backhandRubber: "Rakza 7"
    },
    lastActive: "2025-04-08"
  },
  {
    id: "p14",
    name: "Liu Yang",
    location: { city: "Chennai", state: "Tamil Nadu" },
    skillLevel: "Professional",
    rating: 2550,
    playingStyle: "Offensive",
    playingHand: "Right-Handed",
    gripStyle: "Penhold",
    yearsPlaying: 16,
    availability: ["Weekday Mornings", "Weekend Afternoons"],
    trainingPreferences: ["Tournament Preparation", "Coaching Sessions"],
    tournaments: ["National Tournaments", "International Open"],
    languages: ["English", "Mandarin", "Tamil"],
    equipment: {
      blade: "DHS Hurricane Long 5",
      forehandRubber: "Hurricane 3 Neo",
      backhandRubber: "Hurricane 3 Neo"
    },
    lastActive: "2025-04-08"
  },
  {
    id: "p15",
    name: "Anita Gupta",
    location: { city: "Kolkata", state: "West Bengal" },
    skillLevel: "Advanced",
    rating: 2050,
    playingStyle: "Counter-Attack",
    playingHand: "Left-Handed",
    gripStyle: "Shakehand",
    yearsPlaying: 7,
    availability: ["Weekday Afternoons", "Weekend Mornings"],
    trainingPreferences: ["Competitive Matches", "Tournament Preparation"],
    tournaments: ["State Championships", "National Tournaments"],
    languages: ["English", "Hindi", "Bengali"],
    equipment: {
      blade: "Butterfly Timo Boll ALC",
      forehandRubber: "Tenergy 64",
      backhandRubber: "Tenergy 05"
    },
    lastActive: "2025-04-07"
  }
];

export const cities = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Kochi",
  "Lucknow"
];

export const states = [
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Telangana",
  "Tamil Nadu",
  "West Bengal",
  "Gujarat",
  "Kerala",
  "Uttar Pradesh"
];

export const availabilitySlots = [
  "Weekday Mornings",
  "Weekday Afternoons",
  "Weekday Evenings",
  "Weekend Mornings",
  "Weekend Afternoons",
  "Weekend Evenings"
];