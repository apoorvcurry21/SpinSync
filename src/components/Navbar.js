import React from 'react';
import { Link } from 'react-router-dom';  // Add this import
import '../styles/Navbar.scss';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">SpinSync</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/find-players">Find Players</Link></li>
        <li><Link to="/find-tables">Find Tables</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
