import React from "react";
import products from "../data/products"; // your dummy data

function Marketplace() {
  return (
    <div className="page-container">
      <section className="hero">
        <h2>Marketplace</h2>
        <p>Browse all listings below:</p>
      </section>

      <div className="grid">
        {products.map(product => (
          <div key={product.id} className="card">
            <img src={product.image} alt={product.title} />
            <div className="card-content">
              <h4>{product.title}</h4>
              <p>{product.description}</p>
              <p className="price">R{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Marketplace;
