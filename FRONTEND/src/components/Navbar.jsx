import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";

function Navbar({ cartCount = 0, wishlistCount = 0 }) {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/signin");
  };

  return (
    <nav className="navbar">
      <div>
        <Link to="/" className="navbar-logo">NWU Marketplace</Link>
      </div>
      <ul className="navbar-menu">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/marketplace">Marketplace</Link>
        </li>
        {currentUser ? (
          <>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            {/* Dashboard link for all roles */}
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <span
                className="nav-link subtle-signout"
                onClick={handleSignOut}
                style={{ cursor: "pointer" }}
              >
                Sign Out
              </span>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/signin">Sign In</Link>
            </li>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
          </>
        )}
        <li>
          <Link to="/wishlist" className="icon-link">
            <FaHeart className="nav-icon" />
            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
          </Link>
        </li>
        <li>
          <Link to="/cart" className="icon-link">
            <FaShoppingCart className="nav-icon" />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
