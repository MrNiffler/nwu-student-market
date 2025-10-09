import React, { useEffect, useState } from "react";
import { getUserWishlist, removeFromWishlist } from "../api/endpoints";
import { Link } from "react-router-dom";

function Wishlist({ wishlist, setWishlist }) {
  const [loading, setLoading] = useState(true);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id || storedUser?._id || null;

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId) return;
      try {
        const res = await getUserWishlist(userId);
        setWishlist(res.data);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [userId]);

  const handleRemove = async (listingId) => {
    try {
      await removeFromWishlist(listingId);
      setWishlist(wishlist.filter((item) => item.id !== listingId));
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };

  if (loading) return <h3>Loading wishlist...</h3>;

  if (!wishlist || wishlist.length === 0)
    return (
      <div className="page-container">
        <h2>Your wishlist is empty </h2>
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
