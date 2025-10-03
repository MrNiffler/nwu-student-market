import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

function CheckoutPage({ cart, setCart, addNotification }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      addNotification("Your cart is empty!", "error");
      return;
    }

    setLoading(true);

    try {
      // Replace with your backend orders endpoint
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });

      if (!res.ok) throw new Error("Failed to place order");

      const data = await res.json();

      setCart([]); // Clear cart after successful order
      addNotification("Order placed successfully! 🎉", "success");
      navigate("/success"); // Redirect to success page
    } catch (err) {
      console.error("Order error:", err);
      addNotification("Order failed. Please try again.", "error");
      navigate("/cancel"); // Redirect to cancel page
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

      <Link to="/marketplace" className="btn-secondary" style={{ marginTop: "1rem", display: "inline-block" }}>
        Continue Shopping
      </Link>
    </div>
  );
}

export default CheckoutPage;
