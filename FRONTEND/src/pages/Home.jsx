import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllListings } from "../api/endpoints";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllListings()
      .then((res) => setProducts(res.data.slice(0, 4)))
      .catch(() => setProducts([]));
  }, []);

  return (
    <div className="page-container">
      <section className="hero">
        <h2>Buy, sell and trade safely with fellow NWU students</h2>
        <p>Verified access, private messaging, and student-only listings.</p>
      </section>

      <section className="controls">
        <input className="search-bar" type="search" placeholder="Search listings (title, category)..." />
      </section>

      <section className="listings">
        <h3>Featured Listings</h3>
        <div className="grid">
          {products.map((product) => (
            <div key={product.id} className="card">
              <img src={product.image} alt={product.title} className="product-img" />
              <div className="card-content">
                <h4>{product.title}</h4>
                <p>{product.description}</p>
                <p className="price">R{product.price}</p>
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <Link to="/marketplace" className="btn-primary">
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
