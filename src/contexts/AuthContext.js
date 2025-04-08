import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, firestore } from '../firebaseConfig';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile as firebaseUpdateProfile
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  limit
} from 'firebase/firestore';
import { populateDatabase } from '../utils/populateDatabase';

// Create Auth Context
const AuthContext = createContext();

// Hook to use the auth context
export const useAuthState = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthState must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAndPopulateDatabase = async () => {
    try {
      // Check if we have any tables or players in the database
      const tablesQuery = query(collection(firestore, 'tables'), limit(1));
      const playersQuery = query(collection(firestore, 'players'), limit(1));
      
      const [tablesSnapshot, playersSnapshot] = await Promise.all([
        getDocs(tablesQuery),
        getDocs(playersQuery)
      ]);

      // If both collections are empty, populate the database
      if (tablesSnapshot.empty && playersSnapshot.empty) {
        await populateDatabase();
      }
    } catch (err) {
      console.error('Error checking/populating database:', err);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setLoading(true);
      if (authUser) {
        setUser(authUser);
        try {
          // Fetch user profile from Firestore
          const userDocRef = doc(firestore, 'users', authUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          } else {
            // Create initial profile document if it doesn't exist
            const initialProfile = {
              name: authUser.displayName || '',
              email: authUser.email,
              uid: authUser.uid,
              createdAt: new Date().toISOString(),
              profileCompleted: false
            };
            await setDoc(userDocRef, initialProfile);
            setUserProfile(initialProfile);
          }

          // Check and populate database with sample data if needed
          await checkAndPopulateDatabase();
        } catch (err) {
          console.error('Error fetching user profile:', err);
          setError(err.message);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign up function
  const signUp = async (email, password, displayName, additionalData = {}) => {
    try {
      setLoading(true);
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      if (displayName) {
        await firebaseUpdateProfile(userCredential.user, {
          displayName
        });
      }

      // Create user document in Firestore
      const userDocRef = doc(firestore, 'users', userCredential.user.uid);
      const userData = {
        name: displayName || '',
        email: userCredential.user.email,
        uid: userCredential.user.uid,
        createdAt: new Date().toISOString(),
        skillLevel: additionalData.skillLevel || '',
        location: additionalData.location || '',
        gamesPlayed: 0,
        connections: 0,
        profileCompleted: true
      };

      await setDoc(userDocRef, userData);
      setUserProfile(userData);

      // Also create a player document
      const playerDocRef = doc(firestore, 'players', userCredential.user.uid);
      await setDoc(playerDocRef, {
        ...userData,
        availability: [],
        playingStyle: '',
        bio: '',
        lookingForMatch: true
      });

      return userCredential.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Fetch user profile after login
      const userDocRef = doc(firestore, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      }
      
      return userCredential.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const logOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await signOut(auth);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      setLoading(true);
      setError(null);
      
      const userDocRef = doc(firestore, 'users', user.uid);
      await updateDoc(userDocRef, {
        ...profileData,
        updatedAt: new Date().toISOString(),
        profileCompleted: true
      });
      
      // Refetch the profile
      const updatedDoc = await getDoc(userDocRef);
      setUserProfile(updatedDoc.data());
      
      return updatedDoc.data();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    signUp,
    signIn,
    logOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;