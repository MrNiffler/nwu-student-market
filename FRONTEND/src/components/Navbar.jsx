import React from "react";
import { Link } from "react-router-dom"; // if using react-router

const Navbar = () => {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <h1 className="brand">NWU Student Market</h1>
        <nav className="main-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/marketplace" className="nav-link">Marketplace</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
          <Link to="/login" className="nav-link">Login</Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;