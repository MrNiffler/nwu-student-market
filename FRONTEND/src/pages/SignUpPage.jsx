import React, { useState } from "react";
import { Link } from "react-router-dom";
import { isEmail, passwordStrong, notEmpty } from "../utils/validators";
import "./SignUpPage.css";

export default function SignUpPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // --- Validations ---
    if (!notEmpty(form.firstName) || !notEmpty(form.lastName)) {
      setError("Please enter your name");
      return;
    }

    if (!isEmail(form.email)) {
      setError("Enter a valid email");
      return;
    }

    if (!passwordStrong(form.password)) {
      setError(
        "Password must be at least 8 characters and include letters and numbers"
      );
      return;
    }

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    setBusy(true);

    try {
      // --- UAT: Store in localStorage instead of backend ---
      await new Promise((r) => setTimeout(r, 500)); // simulate delay

      const users = JSON.parse(localStorage.getItem("uatUsers") || "[]");
      if (users.some((u) => u.email === form.email)) {
        throw new Error("Email already registered");
      }

      users.push({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      localStorage.setItem("uatUsers", JSON.stringify(users));
      setSuccess(`Signup successful! Welcome, ${form.firstName}`);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirm: "",
      });
    } catch (err) {
      setError(err.message);
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
              onChange={(e) =>
                setForm({ ...form, firstName: e.target.value })
              }
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

        {/* Password with hover tooltip */}
        <label>Password</label>
        <div className="tooltip-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
            required
          />
          <span className="tooltip">
            Password must be at least 8 characters and include letters and numbers
          </span>
        </div>
        <div className="checkbox-wrapper">
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <label htmlFor="showPassword">Show Password</label>
        </div>

        {/* Confirm Password with hover tooltip */}
        <label>Confirm Password</label>
        <div className="tooltip-wrapper">
          <input
            type={showConfirm ? "text" : "password"}
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            placeholder="••••••••"
            required
          />
          <span className="tooltip">Re-enter your password to confirm</span>
        </div>
        <div className="checkbox-wrapper">
          <input
            type="checkbox"
            id="showConfirm"
            checked={showConfirm}
            onChange={() => setShowConfirm(!showConfirm)}
          />
          <label htmlFor="showConfirm">Show Password</label>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

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




