import React from "react";
import products from "../data/products";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="hero">
        <h2>Buy, sell and trade safely with fellow NWU students</h2>
        <p>Verified access, private messaging, and student-only listings.</p>
      </section>

      {/* Search Bar */}
      <section className="controls">
        <input
          className="search-bar"
          type="search"
          placeholder="Search listings (title, category)..."
        />
      </section>

      {/* Featured Listings */}
      <section className="listings">
        <h3>Featured Listings</h3>
        <div className="grid">
          {products.slice(0, 4).map((product) => (
            <div key={product.id} className="card">
              <img
                src={product.image}
                alt={product.title}
                className="product-img"
              />
              <div className="card-content">
                <h4>{product.title}</h4>
                <p>{product.description}</p>
                <p className="price">R{product.price}</p>
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <Link to="/" className="btn-primary">
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;