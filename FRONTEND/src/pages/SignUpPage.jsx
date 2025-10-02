import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isEmail, passwordStrong, notEmpty } from "../utils/validators";

export default function SignUpPage() {
  const { signUp } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!notEmpty(form.firstName) || !notEmpty(form.lastName)) {
      setError("Please enter your name");
      return;
    }
    if (!isEmail(form.email)) {
      setError("Enter a valid email");
      return;
    }
    if (!passwordStrong(form.password)) {
      setError("Password must be 8+ chars and include letters and numbers");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    setBusy(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      await signUp(form);
      nav("/profile");
    } catch (err) {
      setError(err.message || "Failed to sign up");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="center-card slide-up">
      <h1 className="page-title">Create Account</h1>
      <p className="muted">Join the NWU Student Market</p>

      <form onSubmit={onSubmit} className="form">
        <div className="grid-2">
          <div>
            <label>First Name</label>
            <input
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              placeholder="Kamo"
              required
            />
          </div>
          <div>
            <label>Last Name</label>
            <input
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              placeholder="M"
              required
            />
          </div>
        </div>

        <label>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@nwu.ac.za"
          required
        />

        <label>Phone</label>
        <input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="072 000 1111"
        />

        <label>Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="••••••••"
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          placeholder="••••••••"
          required
        />

        {error && <div className="error">{error}</div>}

        <button className="btn btn-primary" disabled={busy}>
          {busy ? "Creating..." : "Create Account"}
        </button>
      </form>

      <div className="spacer" />
      <div className="row">
        <span className="muted">Already have an account?</span>
        <Link to="/signin">Sign in</Link>
      </div>
    </div>
  );
}
