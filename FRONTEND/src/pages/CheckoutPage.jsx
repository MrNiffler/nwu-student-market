import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { getUserCart } from "../api/endpoints";

function CheckoutPage({ cart, setCart, addNotification }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
      }
    };
    fetchCart();
  }, [userId]);

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      addNotification("Your cart is empty!", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, items: cart }),
      });

      if (!res.ok) throw new Error("Failed to place order");

      const data = await res.json();

      setCart([]); // Clear cart
      addNotification("Order placed successfully! 🎉", "success");
      navigate("/success");
    } catch (err) {
      console.error("Order error:", err);
      addNotification("Order failed. Please try again.", "error");
      navigate("/cancel");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0)
    return (
      <div className="page-container">
        <h2>
          <FaShoppingCart /> Your cart is empty 😢
        </h2>
        <Link to="/marketplace" className="btn-primary" style={{ marginTop: "1rem" }}>
          Browse Marketplace
        </Link>
      </div>
    );

  return (
    <div className="page-container">
      <h2>
        <FaShoppingCart /> Checkout
      </h2>

      <div className="checkout-items">
        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.title} className="cart-img" />
            <div>
              <h4>{item.title}</h4>
              <p>R{item.price}</p>
            </div>
          </div>
        ))}
      </div>

      <h3>Total: R{totalAmount}</h3>

      <button
        onClick={handlePlaceOrder}
        className="btn-primary"
        disabled={loading}
        style={{ marginTop: "1rem" }}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>

      <Link
        to="/marketplace"
        className="btn-secondary"
        style={{ marginTop: "1rem", display: "inline-block" }}
      >
        Continue Shopping
      </Link>
    </div>
  );
}

export default CheckoutPage;
