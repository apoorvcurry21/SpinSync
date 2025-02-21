import { auth } from "../firebaseConfig"; // 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

// Sign up function
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error during sign up:", error.message);
    throw error;
  }
};

// Sign in function
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error during sign in:", error.message);
    throw error;
  }
};

// Sign out function
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error during sign out:", error.message);
    throw error;
  }
};
