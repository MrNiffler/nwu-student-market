import React from "react";
import { removeFromWishlist } from "../api/endpoints";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaHeart } from "react-icons/fa";


function Wishlist({ wishlist, setWishlist }) {
  const handleRemove = (id) => {
    removeFromWishlist(id).then(() => {
      setWishlist(wishlist.filter((item) => item.id !== id));
    });
  };

  if (!wishlist || wishlist.length === 0)
    return (
      <div className="page-container">
        <h2>Your wishlist is empty 😢</h2>
        <Link to="/marketplace" className="btn-primary">
          Browse Marketplace
        </Link>
      </div>
    );

  return (
    <div className="page-container">
      <h2>Your Wishlist</h2>
      {wishlist.map((item) => (
        <div key={item.id} className="wishlist-item">
          <img src={item.image} alt={item.title} className="wishlist-img" />
          <div>
            <h4>{item.title}</h4>
            <p>R{item.price}</p>
            <button onClick={() => handleRemove(item.id)} className="btn-secondary">
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Wishlist;
