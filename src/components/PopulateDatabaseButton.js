import React, { useState } from 'react';
import { populateDatabase } from '../utils/populateDatabase';

const PopulateDatabaseButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePopulateDatabase = async () => {
    if (window.confirm('Are you sure you want to populate the database with sample data? This will add sample tables and players to your Firebase database.')) {
      setIsLoading(true);
      try {
        const result = await populateDatabase();
        if (result.success) {
          alert(`Database populated successfully! Added ${result.tablesAdded} tables and ${result.playersAdded} players.`);
        } else {
          alert(`Error populating database: ${result.error}`);
        }
      } catch (error) {
        console.error('Error in populating database:', error);
        alert(`Error populating database: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <button 
      onClick={handlePopulateDatabase}
      disabled={isLoading}
    >
      {isLoading ? 'Adding Sample Data...' : 'Populate Database with Sample Data'}
    </button>
  );
};

export default PopulateDatabaseButton; 