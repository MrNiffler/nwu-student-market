import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth(); // Assuming your AuthContext has setUser

  useEffect(() => {
    const handleOAuth = async () => {
      try {
        // ----------------------------
        // Dummy login for now
        // ----------------------------
        const dummyUser = {
          id: 1,
          name: "Dummy NWU User",
          email: "dummy@student.nwu.ac.za",
          role: "user",
        };

        setUser(dummyUser);
        localStorage.setItem("user", JSON.stringify(dummyUser));
        navigate("/profile");

        // ----------------------------
        // Original OAuth code (commented)
        // ----------------------------
        /*
        // Extract authorization code from URL
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (!code) {
          // No code found, redirect to sign in
          navigate("/signin");
          return;
        }

        // Exchange code for access token/user info via backend
        const response = await fetch(`/api/oauth/nwu/callback?code=${code}`, {
          method: "GET",
          credentials: "include", // if cookies/session are used
        });

        if (!response.ok) {
          throw new Error("OAuth callback failed");
        }

        const data = await response.json();

        if (data.user) {
          setUser(data.user);
          navigate("/profile");
        } else {
          navigate("/signin");
        }
        */
      } catch (err) {
        console.error("OAuth error:", err);
        navigate("/signin");
      }
    };

    handleOAuth();
  }, [navigate, setUser]); // ✅ include navigate and setUser in deps

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Signing you in with NWU...</h2>
      <p>Please wait while we redirect you to your profile.</p>
    </div>
  );
}
