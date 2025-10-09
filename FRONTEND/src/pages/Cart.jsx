import React, { useEffect, useState } from "react";
import { removeFromCart, getUserCart } from "../api/endpoints";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

function Cart({ cart, setCart, addNotification }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // ✅ Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  // Fetch user's cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) return;
      try {
        const res = await getUserCart(userId);
        setCart(res.data.data || []);
      } catch (err) {
        console.error("Error fetching cart:", err);
        addNotification("Failed to load cart", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [userId]);

  const handleRemove = async (id) => {
    try {
      await removeFromCart(id);
      setCart(cart.filter((item) => item.id !== id));
      addNotification("Item removed from cart 🛒", "success");
    } catch (err) {
      console.error("Remove cart item error:", err);
      addNotification("Failed to remove item", "error");
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading) return <p>Loading cart...</p>;

  if (cart.length === 0)
    return (
      <div className="page-container">
        <h2>
          <FaShoppingCart /> Your cart is empty 😢
        </h2>
        <Link to="/marketplace" className="btn-primary">
          Browse Marketplace
        </Link>
      </div>
    );

  return (
    <div className="page-container">
      <h2>
        <FaShoppingCart /> Your Cart
      </h2>
      {cart.map((item) => (
        <div key={item.id} className="cart-item">
          <img src={item.image} alt={item.title} className="cart-img" />
          <div>
            <h4>{item.title}</h4>
            <p>R{item.price}</p>
            <button onClick={() => handleRemove(item.id)} className="btn-secondary">
              Remove
            </button>
          </div>
        </div>
      ))}
      <button onClick={handleCheckout} className="btn-primary">
        Checkout
      </button>
    </div>
  );
}

export default Cart;
