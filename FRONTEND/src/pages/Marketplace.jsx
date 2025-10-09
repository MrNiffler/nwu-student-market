import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getAllListings,
  addToCart as apiAddToCart,
  addToWishlist as apiAddToWishlist,
} from "../api/endpoints";
import "../style.css";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import ChatBox from "../components/ChatBox";

// RatingStars component
function RatingStars({ listingId, userId, currentRating = 0, addNotification }) {
  const [rating, setRating] = useState(currentRating);
  const [hover, setHover] = useState(0);

  const handleSubmit = async (rate) => {
    try {
      const res = await fetch("http://localhost:5000/api/reviews", {
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
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState([]);

  // Get user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id || storedUser?._id || null;

  const addNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Fetch listings
  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await getAllListings();
      const listings = res.data?.data || [];

      const listingsWithExtras = await Promise.all(
        listings.map(async (listing) => {
          // Fetch images
          let images = [];
          try {
            const imgRes = await fetch(
              `http://localhost:5000/api/listings/${listing.id}/images`
            );
            if (imgRes.ok) {
              const imgData = await imgRes.json();
              images = imgData.data || [];
            }
          } catch (err) {
            console.error(`Failed to fetch images for listing ${listing.id}`, err);
          }

          // Fetch ratings
          let avgRating = 0;
          try {
            const ratingRes = await fetch(
              `http://localhost:5000/api/reviews/listing/${listing.id}`
            );
            if (ratingRes.ok) {
              const ratingData = await ratingRes.json();
              if (Array.isArray(ratingData.data) && ratingData.data.length > 0) {
                avgRating =
                  ratingData.data.reduce((sum, r) => sum + (r.rating || 0), 0) /
                  ratingData.data.length;
              }
            }
          } catch (err) {
            console.error(`Failed to fetch ratings for listing ${listing.id}`, err);
          }

          return { ...listing, images, avgRating };
        })
      );

      setProducts(listingsWithExtras);
      setFilteredProducts(listingsWithExtras);
      setLoading(false);
      addNotification("Listings loaded successfully!", "success");
    } catch (err) {
      console.error("Error fetching listings:", err);
      setLoading(false);
      addNotification("Failed to load listings!", "error");
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  // Add to Cart
  const handleAddToCart = async (product) => {
    if (!userId) {
      addNotification("Please log in to add items to your cart", "error");
      return;
    }
    if (!cart.find((item) => item.id === product.id)) {
      try {
        await apiAddToCart({ user_id: userId, listing_id: product.id, quantity: 1 });
        setCart([...cart, product]);
        addNotification(`${product.title} added to cart`, "success");
      } catch (err) {
        console.error("Add to cart error:", err.response?.data || err);
        addNotification("Failed to add to cart", "error");
      }
    } else {
      addNotification(`${product.title} is already in your cart!`, "error");
    }
  };

  // Add to Wishlist
  const handleAddToWishlist = async (product) => {
    if (!userId) {
      addNotification("Please log in to add to your wishlist", "error");
      return;
    }
    if (!wishlist.find((item) => item.id === product.id)) {
      try {
        await apiAddToWishlist({ user_id: userId, listing_id: product.id });
        setWishlist([...wishlist, product]);
        addNotification(`${product.title} added to wishlist`, "success");
      } catch (err) {
        console.error("Add to wishlist error:", err.response?.data || err);
        addNotification("Failed to add to wishlist", "error");
      }
    } else {
      addNotification(`${product.title} is already in your wishlist!`, "error");
    }
  };

  return (
    <div className="marketplace-container">
      <section className="marketplace-hero">
        <h2>Marketplace</h2>
        <p>Browse all listings below:</p>

        <form onSubmit={(e) => e.preventDefault()} className="search-form">
          <input
            type="text"
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </section>

      {loading ? (
        <Spinner />
      ) : (
        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <p>No listings found.</p>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <img
                  src={product.images?.[0]?.full_url || "/placeholder.png"}
                  alt={product.title}
                  className="product-image"
                />
                <div className="product-details">
                  <h4>{product.title}</h4>
                  <RatingStars
                    listingId={product.id}
                    userId={userId}
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
                <ChatBox listingId={product.id} user={{ isLoggedIn: !!userId, id: userId }} />
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
