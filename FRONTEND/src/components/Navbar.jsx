import { Link, useLocation } from "react-router-dom";
import React from "react";

function Navbar() {
  const location = useLocation();

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="logo">NWU Market</div>
        <ul className="nav-links">
          <li>
            <Link
              to="/"
              className={location.pathname === "/" ? "active" : ""}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/marketplace"
              className={location.pathname === "/marketplace" ? "active" : ""}
            >
              Marketplace
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className={location.pathname === "/profile" ? "active" : ""}
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className={location.pathname === "/login" ? "active" : ""}
            >
              Login
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Navbar;
