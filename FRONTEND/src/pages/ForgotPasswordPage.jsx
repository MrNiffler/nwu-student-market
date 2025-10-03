import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./ForgotPasswordPage.css";

function ForgotPassword() {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) return setError("Please enter your email.");

    try {
      await sendPasswordReset(email);
      setMessage("Password reset link sent to your email!");
    } catch (err) {
      setError(err.message);
    }
  };

  // extra animattion just to make it cooler
  const oopsText = "Oops!".split("");

  return (
    <div className="page-container">
      <div className="form-section">
        <div className="oops">
          {oopsText.map((char, idx) => (
            <span key={idx}>{char}</span>
          ))}
        </div>
        <h2 className="form-title">Forgot Password</h2>
        <form className="form-card" onSubmit={handleSubmit}>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {message && <p style={{ color: "green" }}>{message}</p>}
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Send Reset Link</button>
        </form>
        <p>
          Remembered your password? <a href="/signin">Sign In</a>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
