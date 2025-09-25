import React, { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("red");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      setMessage(`Welcome, ${username}! (This is a demo - no real authentication.)`);
      setMessageColor("green");
    } else {
      setMessage("Please fill in all fields.");
      setMessageColor("red");
    }
  };

  return (
    <main className="page-container">
      <section className="hero">
        <h2>Sign In</h2>
        <p>Enter your credentials to access the platform.</p>
      </section>

      <section className="form-section">
        <form className="login-form" onSubmit={handleSubmit}>
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
          <button type="submit" className="btn-primary">
            Sign In
          </button>
        </form>
        {message && (
          <p style={{ color: messageColor, marginTop: "1rem", textAlign: "center" }}>
            {message}
          </p>
        )}
      </section>
    </main>
  );
}

export default Login;
