import { Link } from "react-router-dom";

function Navbar({ cartCount = 0, wishlistCount = 0 }) {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <Link to="/" style={styles.link}>NWU Marketplace</Link>
      </div>
      <ul style={styles.menu}>
        <li>
          <Link to="/" style={styles.link}>Home</Link>
        </li>
        <li>
          <Link to="/marketplace" style={styles.link}>Marketplace</Link>
        </li>
        <li>
          <Link to="/profile" style={styles.link}>Profile</Link>
        </li>
        <li style={styles.icon}>
          <Link to="/wishlist" style={styles.link}>
            Wishlist {wishlistCount > 0 && <span style={styles.badge}>{wishlistCount}</span>}
          </Link>
        </li>
        <li style={styles.icon}>
          <Link to="/cart" style={styles.link}>
            Cart {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
          </Link>
        </li>
      </ul>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    background: "#F9FAFB", // neutral background
    color: "#1F2937", // dark grey text
    fontFamily: "'Roboto', sans-serif",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  logo: {
    fontWeight: "700",
    fontSize: "1.5rem",
    fontFamily: "'Poppins', sans-serif",
    color: "#6C63FF", // primary purple
  },
  menu: {
    listStyle: "none",
    display: "flex",
    gap: "1.5rem",
    alignItems: "center",
    margin: 0,
    padding: 0,
  },
  link: {
    color: "#1F2937",
    textDecoration: "none",
    fontWeight: "500",
    position: "relative",
    padding: "0.5rem 0.8rem",
    borderRadius: "8px",
    transition: "background 0.2s",
  },
  icon: {
    position: "relative",
  },
  badge: {
    background: "#6C63FF", // primary purple
    borderRadius: "50%",
    padding: "0.2rem 0.5rem",
    fontSize: "0.75rem",
    marginLeft: "0.3rem",
    color: "#fff",
    fontWeight: "500",
  },
};

// Add hover effect for menu links
Object.assign(styles.link, {
  ":hover": {
    background: "#EDE9FE", // light lavender
  },
});

export default Navbar;
