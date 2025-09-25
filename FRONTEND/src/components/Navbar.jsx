import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">NWU Student Market</div>
        <ul className="nav-links">
          <li>
            <Link className={location.pathname === "/" ? "active" : ""} to="/">Home</Link>
          </li>
          <li>
            <Link className={location.pathname === "/marketplace" ? "active" : ""} to="/marketplace">Marketplace</Link>
          </li>
          <li>
            <Link className={location.pathname === "/profile" ? "active" : ""} to="/profile">Profile</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
