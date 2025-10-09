// src/pages/SignInPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = await signIn(email, password);

      if (user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              className="w-full border rounded p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your NWU email"
            />
          </div>

          <div>
            <label className="block font-medium">Password</label>
            <input
              type="password"
              className="w-full border rounded p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-semibold"
          >
            Sign In
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Use one of these demo accounts:
        </p>
        <ul className="text-center text-xs text-gray-500 mt-1">
          <li>admin@nwu.ac.za / password123</li>
          <li>buyer@nwu.ac.za / password123</li>
          <li>seller@nwu.ac.za / password123</li>
        </ul>
      </div>
    </div>
  );
}
