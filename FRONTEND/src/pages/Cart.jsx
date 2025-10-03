import React from "react";
import { removeFromCart } from "../api/endpoints";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

function Cart({ cart, setCart, addNotification }) {
  const navigate = useNavigate();

  const handleRemove = (id) => {
    removeFromCart(id).then(() => {
      setCart(cart.filter((item) => item.id !== id));
      addNotification("Item removed from cart 🛒", "success");
    });
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

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
            <button
              onClick={() => handleRemove(item.id)}
              className="btn-secondary"
            >
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
