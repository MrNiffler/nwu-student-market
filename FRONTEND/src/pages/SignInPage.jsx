import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, setAuthToken } from "../api/endpoints.js"; 
import axios from "axios";
import "./SignInPage.css";

export default function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser({ email, password });
      const { token } = res.data;
      if (!token) throw new Error("No token returned from server");

      localStorage.setItem("token", token);
      setAuthToken(token);

      const userRes = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = userRes.data;
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-card slide-up">
      <h1 className="page-title">Sign In</h1>
      <p className="muted">Welcome back to NWU Student Market</p>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="show-hide-btn"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="row">
          <button
            type="button"
            className="link-btn"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </button>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
