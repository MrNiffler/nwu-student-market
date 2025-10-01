import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import productsData from "../data/products"; // Local product data
import "../style.css"; // We'll define the new CSS

// Notification component
function Notification({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${type}`}>
      {message}
    </div>
  );
}

// Spinner component
function Spinner() {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
    </div>
  );
}

function Marketplace({ cart, setCart, wishlist, setWishlist }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  // Add notification
  const addNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  // Remove notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Load products
  useEffect(() => {
    setLoading(true);
    setProducts(productsData);
    setLoading(false);
    addNotification("Products loaded successfully!", "success");
  }, []);

  // Add to cart
  const handleAddToCart = (product) => {
    if (!cart.find(item => item.id === product.id)) {
      setCart([...cart, product]);
      addNotification(`${product.title} added to cart 🛒`, "success");
    } else {
      addNotification(`${product.title} is already in your cart!`, "error");
    }
  };

  // Add to wishlist
  const handleAddToWishlist = (product) => {
    if (!wishlist) return; // Safety check
    if (!wishlist.find(item => item.id === product.id)) {
      setWishlist([...wishlist, product]);
      addNotification(`${product.title} added to wishlist ❤️`, "success");
    } else {
      addNotification(`${product.title} is already in your wishlist!`, "error");
    }
  };

  return (
    <div className="marketplace-container">
      <section className="marketplace-hero">
        <h2>Marketplace</h2>
        <p>Browse all listings below:</p>
      </section>

      {loading ? (
        <Spinner />
      ) : (
        <div className="products-grid">
          {products.length === 0 ? (
            <p>No listings found.</p>
          ) : (
            products.map(product => (
              <div key={product.id} className="product-card">
                <img
                  src={product.image}
                  alt={product.title}
                  className="product-image"
                />
                <div className="product-details">
                  <h4>{product.title}</h4>
                  <p>{product.description}</p>
                  <p className="price">R{product.price}</p>
                </div>
                <div className="product-actions">
                  <button onClick={() => handleAddToCart(product)} className="btn-primary">
                    Add to Cart
                  </button>
                  <button onClick={() => handleAddToWishlist(product)} className="btn-secondary">
                    Wishlist
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="cart-link">
        <Link to="/cart" className="btn-primary">
          Go to Cart ({cart.length})
        </Link>
      </div>

      {notifications.map(notification => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}

export default Marketplace;
