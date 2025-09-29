import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { isEmail, passwordStrong } from "../utils/validators";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", newPassword: "", confirm: "" });
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");
    if (!isEmail(form.email)) {
      setError("Enter a valid email");
      return;
    }
    if (!passwordStrong(form.newPassword)) {
      setError("New password must be 8+ chars and include letters and numbers");
      return;
    }
    if (form.newPassword !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    setBusy(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      await resetPassword(form.email, form.newPassword);
      setOk("Password updated. You can sign in now.");
      setTimeout(() => nav("/signin"), 800);
    } catch (err) {
      setError(err.message || "Could not reset password");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="center-card slide-up">
      <h2>Reset password</h2>
      <p className="muted">Use your account email and a new password</p>

      <form onSubmit={onSubmit} className="form">
        <label>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@nwu.ac.za"
          required
        />

        <label>New password</label>
        <input
          type="password"
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          placeholder="••••••••"
          required
        />

        <label>Confirm new password</label>
        <input
          type="password"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          placeholder="••••••••"
          required
        />

        {error && <div className="error">{error}</div>}
        {ok && <div className="success">{ok}</div>}

        <button className="btn btn-primary" disabled={busy}>
          {busy ? "Updating..." : "Update password"}
        </button>
      </form>

      <div className="spacer" />
      <div className="row">
        <span className="muted">Remembered your password?</span>
        <Link to="/signin">Back to sign in</Link>
      </div>
    </div>
  );
}
