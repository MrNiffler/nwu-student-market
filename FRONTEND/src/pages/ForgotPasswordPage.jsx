import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./SignUpPage.css"; // reuse the same CSS for consistent layout

export default function ForgotPassword() {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) return setError("Please enter your email.");
    if (!email.endsWith("@mynwu.ac.za")) {
      return setError("Please use your NWU email address (studentnumber@mynwu.ac.za).");
    }

    setLoading(true);
    try {
      await sendPasswordReset(email);
      setMessage("Password reset link sent to your NWU email!");
    } catch (err) {
      setError(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-card slide-up">
      <h1 className="page-title">Forgot Password</h1>
      <p className="muted">Enter your NWU email to reset your password</p>

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      {message && <p className="text-green-600 text-sm mb-2">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="studentnumber@mynwu.ac.za"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2">
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <div className="row mt-4">
        <span>Remembered your password?</span>
        <a href="/signin">Sign In</a>
      </div>
    </div>
  );
}
