import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getAllListings,
  addToCart,
  addToWishlist,
} from "../api/endpoints";
import "../style.css";
import { FaShoppingCart, FaHeart } from "react-icons/fa";

// RatingStars component for reviews
function RatingStars({ listingId, userId, currentRating = 0, addNotification }) {
  const [rating, setRating] = useState(currentRating);
  const [hover, setHover] = useState(0);

  const handleSubmit = async (rate) => {
    try {
      const res = await fetch("http://localhost:5000/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewerId: userId,
          listingId,
          rating: rate,
          comment: "",
        }),
      });

      if (!res.ok) throw new Error("Failed to submit rating");

      setRating(rate);
      addNotification("Rating submitted successfully!", "success");
    } catch (err) {
      console.error(err);
      addNotification("Failed to submit rating", "error");
    }
  };

  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hover || rating) ? "filled" : ""}`}
          onClick={() => handleSubmit(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// Notification component
function Notification({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return <div className={`notification ${type}`}>{message}</div>;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Fetch listings from API with optional search
  const fetchListings = async (query = "") => {
    setLoading(true);
    try {
      let res = query
        ? await fetch(`http://localhost:5000/api/search?q=${query}`).then(r => r.json())
        : await getAllListings().then(r => r.data);

      // Fetch average ratings per listing
      res = await Promise.all(
        res.map(async (listing) => {
          try {
            const ratingRes = await fetch(`http://localhost:5000/api/ratings/average/${listing.id}`).then(r => r.json());
            return { ...listing, avgRating: ratingRes.average || 0 };
          } catch {
            return { ...listing, avgRating: 0 };
          }
        })
      );

      setProducts(res);
      setLoading(false);
      addNotification("Products loaded successfully!", "success");
    } catch (err) {
      console.error("Error fetching listings:", err);
      setLoading(false);
      addNotification("Failed to load products!", "error");
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings(searchTerm);
  };

  const handleAddToCart = (product) => {
    if (!cart.find((item) => item.id === product.id)) {
      addToCart(product).then(() => setCart([...cart, product]));
      addNotification(`${product.title} added to cart 🛒`, "success");
    } else {
      addNotification(`${product.title} is already in your cart!`, "error");
    }
  };

  const handleAddToWishlist = (product) => {
    if (!wishlist.find((item) => item.id === product.id)) {
      addToWishlist(product).then(() => setWishlist([...wishlist, product]));
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

        {/* Search Form */}
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn-primary">Search</button>
        </form>
      </section>

      {loading ? (
        <Spinner />
      ) : (
        <div className="products-grid">
          {products.length === 0 ? (
            <p>No listings found.</p>
          ) : (
            products.map((product) => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.title} className="product-image" />
                <div className="product-details">
                  <h4>{product.title}</h4>

                  {/* Rating Stars */}
                  <RatingStars
                    listingId={product.id}
                    userId={1} // Replace with actual logged-in user ID
                    currentRating={product.avgRating || 0}
                    addNotification={addNotification}
                  />

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

      {notifications.map((notification) => (
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
