import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./SignUpPage.css"; // reuse same CSS or separate file as you prefer

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signUp, currentUser } = useAuth();

  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [student_number, setStudentNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Password validation state (true = has error)
  const [passwordErrors, setPasswordErrors] = useState({
    length: true,
    number: true,
    match: true,
  });

  useEffect(() => {
    const length = password.length >= 6;
    const number = /\d/.test(password);
    const match = password === confirmPassword && password !== "";
    // store booleans as "hasError" to match earlier usage (true => error)
    setPasswordErrors({ length: !length, number: !number, match: !match });
  }, [password, confirmPassword]);

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) navigate("/dashboard");
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await signUp(full_name, email, password, student_number, "buyer");

      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-card slide-up signup-container">
      <h1 className="page-title">Create Account</h1>
      <p className="muted">Join the NWU Student Market</p>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="form" autoComplete="on">
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          type="text"
          placeholder="Full Name"
          value={full_name}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="studentNumber">Student Number</label>
        <input
          id="studentNumber"
          type="text"
          placeholder="Student Number"
          value={student_number}
          onChange={(e) => setStudentNumber(e.target.value)}
          required
        />

        {/* Password input with inline eye toggle */}
        <label htmlFor="password">Password</label>
        <div className="input-wrapper">
          <input
            id="password"
            name="password"
            autoComplete="new-password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword((s) => !s)}
            aria-pressed={showPassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.58 10.58a3 3 0 004.24 4.24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2.23 12.13C3.83 7.5 7.5 4 12 4c2.2 0 4.2.82 5.77 2.18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21.77 11.86C20.17 16.5 16.5 20 12 20c-2.2 0-4.2-.82-5.77-2.18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>

        <div className="text-xs" aria-live="polite" style={{ color: "#b91c1c", marginBottom: 8 }}>
          {passwordErrors.length && <div>Password must be at least 6 characters long.</div>}
          {passwordErrors.number && <div>Password must include at least one number.</div>}
        </div>

        {/* Confirm Password with inline eye toggle */}
        <label htmlFor="confirmPassword">Confirm Password</label>
        <div className="input-wrapper">
          <input
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="new-password"
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowConfirm((s) => !s)}
            aria-pressed={showConfirm}
            aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
            title={showConfirm ? "Hide confirm password" : "Show confirm password"}
          >
            {showConfirm ? (
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.58 10.58a3 3 0 004.24 4.24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2.23 12.13C3.83 7.5 7.5 4 12 4c2.2 0 4.2.82 5.77 2.18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21.77 11.86C20.17 16.5 16.5 20 12 20c-2.2 0-4.2-.82-5.77-2.18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>

        <div className="text-xs" aria-live="polite" style={{ color: "#b91c1c", marginBottom: 8 }}>
          {passwordErrors.match && <div>Passwords do not match.</div>}
        </div>

        <button
          type="submit"
          disabled={passwordErrors.length || passwordErrors.number || passwordErrors.match || loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
