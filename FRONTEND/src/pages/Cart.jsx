import React from "react";
import { removeFromCart, createOrder } from "../api/endpoints";
import { Link } from "react-router-dom";

function Cart({ cart, setCart }) {
  const handleRemove = (id) => {
    removeFromCart(id).then(() => {
      setCart(cart.filter((item) => item.id !== id));
    });
  };

  const handleCheckout = () => {
    createOrder({ items: cart }).then(() => {
      alert("Order placed successfully!");
      setCart([]);
    });
  };

  if (cart.length === 0)
    return (
      <div className="page-container">
        <h2>Your cart is empty 😢</h2>
        <Link to="/marketplace" className="btn-primary">
          Browse Marketplace
        </Link>
      </div>
    );

  return (
    <div className="page-container">
      <h2>Your Cart</h2>
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
