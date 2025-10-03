import "./SignInPage.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignInPage() {
  const { signIn } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      
      await new Promise((r) => setTimeout(r, 400));

      // Sign in with your auth context
      await signIn(form.email, form.password);

      // Redirect to profile or dashboard
      nav("/profile");
    } catch (err) {
      setError(err.message || "Failed to sign in");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="center-card slide-up">
      <h1 className="page-title">Welcome Back</h1>
      <p className="muted">Sign in to continue to NWU Student Market</p>

      <form onSubmit={onSubmit} className="form">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@nwu.ac.za"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="••••••••"
          required
        />

        {error && <div className="error">{error}</div>}

        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="spacer" />

      <div className="row">
        <span className="muted">No account?</span>
        <Link to="/signup">Create one</Link>
      </div>

      <div className="row">
        <span className="muted">Forgot your password?</span>
        <Link to="/forgot-password">Reset it</Link>
      </div>
    </div>
  );

}
