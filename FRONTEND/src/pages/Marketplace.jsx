import React from "react";
import { products } from "../data/products";
import { Link } from "react-router-dom";

const Marketplace = () => {
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
        <h2>Marketplace</h2>
        <div style={styles.grid}>
          {products.map(product => (
            <div key={product.id} style={styles.card}>
              <img src={product.image} alt={product.title} style={styles.img} />
              <h3>{product.title}</h3>
              <p>{product.category}</p>
              <p>{product.price}</p>
            </div>
          ))}
        </div>
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
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.5rem" },
  card: { border: "1px solid #ccc", borderRadius: "8px", padding: "1rem", textAlign: "center", backgroundColor: "#fff" },
  img: { width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" },
  footer: { textAlign: "center", padding: "1rem", marginTop: "2rem", backgroundColor: "#F9FAFB", color: "#1F2937" }
};

export default Marketplace;
