import React from "react";
import { Link } from "react-router-dom";
import products from "../data/products";

function Marketplace({ cart, setCart, wishlist, setWishlist }) {
  const handleAddToCart = (product) => {
    if (!cart.find((item) => item.id === product.id)) {
      setCart([...cart, product]);
      alert(`${product.title} added to cart 🛒`);
    } else {
      alert(`${product.title} is already in your cart!`);
    }
  };

  const handleAddToWishlist = (product) => {
    if (!wishlist.find((item) => item.id === product.id)) {
      setWishlist([...wishlist, product]);
      alert(`${product.title} added to wishlist ❤️`);
    } else {
      alert(`${product.title} is already in your wishlist!`);
    }
  };

  return (
    <div className="page-container">
      <section className="hero">
        <h2>Marketplace</h2>
        <p>Browse all listings below:</p>
      </section>

      <div className="grid">
        {products.map((product) => (
          <div key={product.id} className="card">
            <img src={product.image} alt={product.title} className="product-img" />
            <div className="card-content">
              <h4>{product.title}</h4>
              <p>{product.description}</p>
              <p className="price">R{product.price}</p>
            </div>
            <div className="actions">
              <button className="btn btn-cart" onClick={() => handleAddToCart(product)}>
                Add to Cart
              </button>
              <button className="btn btn-wishlist" onClick={() => handleAddToWishlist(product)}>
                Wishlist
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <Link to="/cart" className="btn-primary">
          Go to Cart ({cart.length})
        </Link>
      </div>
    </div>
  );
}

export default Marketplace;
