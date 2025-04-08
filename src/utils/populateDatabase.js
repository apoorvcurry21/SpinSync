import { db } from '../firebaseConfig';
import { addSampleDataToFirebase } from './sampleData';

// This function can be called to populate the database with sample data
export const populateDatabase = async () => {
  try {
    console.log('Initializing database with sample data...');
    const result = await addSampleDataToFirebase(db);
    
    if (result.success) {
      console.log(`Successfully initialized database with ${result.tableCount} tables and ${result.playerCount} players.`);
      return {
        success: true,
        tableCount: result.tableCount,
        playerCount: result.playerCount,
        message: 'Database initialized successfully'
      };
    } else {
      console.error('Failed to initialize database:', result.error);
      return { 
        success: false, 
        error: result.error 
      };
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Run this function from the browser console or use a button in development mode
// populateDatabase();

// Create a component to add sample data in development mode
export const PopulateDatabaseButton = ({ onComplete }) => {
  const handlePopulate = async () => {
    if (window.confirm('Are you sure you want to add sample data to the database? This should only be done in development.')) {
      try {
        const result = await populateDatabase();
        if (result.success) {
          alert('Sample data added successfully!');
          if (onComplete) onComplete(result);
        } else {
          alert(`Failed to add sample data: ${result.error}`);
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  // Only show this in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <button 
      onClick={handlePopulate}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '10px 15px',
        background: '#ff5722',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        zIndex: 9999
      }}
    >
      Populate Database with Sample Data
    </button>
  );
};

export default populateDatabase;