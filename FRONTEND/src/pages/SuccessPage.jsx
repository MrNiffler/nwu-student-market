import React from "react";
import { Link } from "react-router-dom";
import "./CheckoutPage.css"; // reuse same styles for consistency

function SuccessPage() {
  return (
    <div className="checkout-container success-container">
      <h2 className="checkout-title">🎉 Order Successful!</h2>
      <p className="checkout-message">Thank you for your purchase. Your order has been placed successfully.</p>
      <Link to="/marketplace" className="btn btn-primary checkout-btn">
        Continue Shopping
      </Link>
    </div>
  );
}

export default SuccessPage;
