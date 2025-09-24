import React from "react";
import products from "../data/products"; // dummy data

function Marketplace() {
  return (
    <main>
      <div className="page-container">
        <h2>Marketplace</h2>
        <p>Browse all listings below:</p>
        <div className="grid">
          {products.map(product => (
            <div key={product.id} className="card">
              <img src={product.image} alt={product.title} />
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <p><strong>R{product.price}</strong></p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Marketplace;
