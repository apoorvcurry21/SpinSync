import React, { useState } from "react";
import { signUp, signIn, logOut } from "../utils/auth";

const UserAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignUp = async () => {
    try {
      await signUp(email, password);
      setIsAuthenticated(true);
    } catch (error) {
      console.log("Sign up failed", error);
    }
  };

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      setIsAuthenticated(true);
    } catch (error) {
      console.log("Sign in failed", error);
    }
  };

  const handleLogOut = async () => {
    try {
      await logOut();
      setIsAuthenticated(false);
    } catch (error) {
      console.log("Sign out failed", error);
    }
  };

  return (
    <div>
      {!isAuthenticated ? (
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSignUp}>Sign Up</button>
          <button onClick={handleSignIn}>Sign In</button>
        </div>
      ) : (
        <div>
          <h2>Welcome! You are signed in.</h2>
          <button onClick={handleLogOut}>Log Out</button>
        </div>
      )}
    </div>
  );
};

export default UserAuth;
