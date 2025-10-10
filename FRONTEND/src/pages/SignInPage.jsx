import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./SignUpPage.css"; // reuse same styling for consistent card

export default function SignInPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = await signIn(email, password);

      // Redirect based on role
      if (user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard"); // Regular user dashboard
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "Invalid email or password");
    }
  };

  return (
    <div className="center-card slide-up">
      <h1 className="page-title text-center">Sign In</h1>
      <p className="muted text-center mb-4">Welcome back to NWU Student Market</p>

      {error && <p className="text-red-600 text-sm mb-2 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your NWU email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Forgot Password link */}
        <div className="text-right">
          <Link to="/forgot-password" className="text-blue-600 text-sm hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full mt-2"
        >
          Sign In
        </button>
      </form>

      <p className="text-center mt-4 text-sm text-gray-600">
        Use one of these demo accounts:
      </p>
      <ul className="text-center text-xs text-gray-500 mt-1 space-y-1">
        <li>admin@nwu.ac.za / password123</li>
        <li>buyer@nwu.ac.za / password123</li>
        <li>seller@nwu.ac.za / password123</li>
      </ul>
    </div>
  );
}
