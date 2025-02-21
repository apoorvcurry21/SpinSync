import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import FindPlayers from "./components/FindPlayers";
import FindTables from "./components/FindTables";
import Profile from "./components/Profile";
import UserAuth from "./components/UserAuth"; // 


function App() {
  return (
    <UserAuth>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/find-players" element={<FindPlayers />} />
          <Route path="/find-tables" element={<FindTables />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </UserAuth>
  );
}

export default App;