import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <header style={styles.header}>
        <div style={styles.container}>
          <h1 style={styles.brand}>NWU Student Market</h1>
          <nav>
            <Link style={styles.navLink} to="/">Home</Link>
            <Link style={styles.navLink} to="/marketplace">Marketplace</Link>
            <Link style={styles.navLink} to="/login">Login</Link>
          </nav>
        </div>
      </header>

      <main style={styles.main}>
        <section style={styles.hero}>
          <h2>Buy, sell and trade safely with fellow NWU students</h2>
          <p>Verified access, private messaging and student-only listings.</p>
        </section>

        <section style={styles.controls}>
          <input
            type="search"
            placeholder="Search listings (title, category)..."
            style={styles.searchInput}
          />
        </section>

        <section style={styles.listings}>
          <h3>Featured Listings</h3>
          <div style={styles.grid} id="productsGrid">
            {/* Optional: Later fetch real products */}
          </div>
        </section>
      </main>

      <footer style={styles.footer}>
        <p>© 2025 NWU Student Market</p>
      </footer>
    </div>
  );
};

const styles = {
  header: { width: "100%", backgroundColor: "#6C63FF", color: "#fff", padding: "1rem 0" },
  container: { maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 1rem" },
  brand: { margin: 0 },
  navLink: { margin: "0 0.5rem", color: "#fff", textDecoration: "none" },
  main: { padding: "2rem 1rem", maxWidth: "1200px", margin: "0 auto" },
  hero: { textAlign: "center", marginBottom: "2rem" },
  controls: { textAlign: "center", marginBottom: "2rem" },
  searchInput: { padding: "0.5rem", width: "100%", maxWidth: "400px", borderRadius: "8px", border: "1px solid #ccc" },
  listings: {},
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.5rem" },
  footer: { textAlign: "center", padding: "1rem", marginTop: "2rem", backgroundColor: "#F9FAFB", color: "#1F2937" }
};

export default Home;

