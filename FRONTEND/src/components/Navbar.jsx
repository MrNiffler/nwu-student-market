import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar({ cartCount = 0, wishlistCount = 0 }) {
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
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/signin">Sign In</Link>
        </li>
        <li>
          <Link to="/signup">Sign Up</Link>
        </li>
        <li>
          <Link to="/wishlist">
            Wishlist {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
          </Link>
        </li>
        <li>
          <Link to="/cart">
            Cart {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;


