import React from "react";
import { Link, NavLink } from "react-router-dom";
import "../style.css"; // Make sure this path is correct

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">NWU Student Market</div>
        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/marketplace" className={({ isActive }) => isActive ? "active" : ""}>
              Marketplace
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink to="/signin" className={({ isActive }) => isActive ? "active" : ""}>
              Sign In
            </NavLink>
          </li>
          <li>
            <NavLink to="/signup" className={({ isActive }) => isActive ? "active" : ""}>
              Sign Up
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
