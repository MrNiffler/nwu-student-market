import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./SignInPage.css";

export default function SignInPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="center-card slide-up">
      <h1 className="page-title">Welcome Back</h1>
      <p className="muted">Sign in to continue to NWU Student Market</p>

      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="btn btn-primary">Sign in</button>
      </form>

      {/* ----------------------------
          Original OAuth link (commented out)
      ---------------------------- */}
      {/*
      <a href={oauthLink} className="btn btn-primary">
        Sign in with NWU
      </a>
      */}
    </div>
  );
}
