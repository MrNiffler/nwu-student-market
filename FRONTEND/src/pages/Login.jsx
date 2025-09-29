// src/pages/Login.jsx
import React, { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      setMessage(`Welcome, ${username}! (This is a demo - no real authentication.)`);
    } else {
      setMessage("Please fill in all fields.");
    }
  };

  return (
    <main className="page-container">
      <section className="login-page">
        <h2 className="page-title">Sign In</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary">Sign In</button>
          {message && (
            <p className={`form-message ${message.includes("Welcome") ? "success" : "error"}`}>
              {message}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}

export default Login;
