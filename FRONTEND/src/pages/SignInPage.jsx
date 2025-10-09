import React from "react";
import { Link } from "react-router-dom";
import "./SignInPage.css";

export default function SignInPage() {
  // Replace this with the official NWU OAuth URL from IT
  const NWU_OAUTH_URL = "https://YOUR_NWU_OAUTH_DOMAIN/oauth/authorize";
  const CLIENT_ID = "YOUR_CLIENT_ID"; // Provided by NWU
  const REDIRECT_URI = "http://localhost:3000/oauth/callback"; // Make sure this is registered
  const SCOPE = "openid email profile";

  const oauthLink = `${NWU_OAUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=code&scope=${encodeURIComponent(SCOPE)}`;

  return (
    <div className="center-card slide-up">
      <h1 className="page-title">Welcome Back</h1>
      <p className="muted">Sign in to continue to NWU Student Market</p>

      <a href={oauthLink} className="btn btn-primary">
        Sign in with NWU
      </a>

      <div className="spacer" />
      <div className="row">
        <span className="muted">No account?</span>
        <a href={oauthLink}>Sign up with NWU</a>
      </div>

      <div className="row">
        <span className="muted">Forgot your password?</span>
        <Link to="/forgot-password">Reset via NWU</Link>
      </div>
    </div>
  );
}
