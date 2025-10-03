import React from "react";
import { Link } from "react-router-dom";
import "./CheckoutPage.css"; // reuse same styles

function CancelPage() {
  return (
    <div className="checkout-container cancel-container">
      <h2 className="checkout-title">⚠️ Payment Cancelled</h2>
      <p className="checkout-message">Your payment was not completed. You can review your cart and try again.</p>
      <Link to="/cart" className="btn btn-secondary checkout-btn">
        Go Back to Cart
      </Link>
    </div>
  );
}

export default CancelPage;
