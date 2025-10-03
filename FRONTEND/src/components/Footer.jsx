import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css"; 

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left side: copyright */}
        <p>&copy; {new Date().getFullYear()} NWU Student Market. All rights reserved.</p>

        {/* Right side: navigation links */}
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/signin">Sign In</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </footer>
  );
}

