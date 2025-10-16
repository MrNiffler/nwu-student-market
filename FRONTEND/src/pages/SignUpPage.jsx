import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./SignUpPage.css"; // reuse same CSS

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
  const [invalidEmail, setInvalidEmail] = useState(false);

  // Password validation state
  const [passwordErrors, setPasswordErrors] = useState({
    length: true,
    number: true,
    match: true,
  });

  useEffect(() => {
    const length = password.length >= 6;
    const number = /\d/.test(password);
    const match = password === confirmPassword && password !== "";
    setPasswordErrors({ length: !length, number: !number, match: !match });
  }, [password, confirmPassword]);

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) navigate("/dashboard");
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInvalidEmail(false);

    // NWU email validation
    if (!email.toLowerCase().endsWith("@mynwu.ac.za")) {
      setError("You cannot sign up without a NWU email address.");
      setInvalidEmail(true);
      return;
    }

    if (passwordErrors.length || passwordErrors.number || passwordErrors.match) {
      setError("Please fix the errors above before signing up.");
      return;
    }

    try {
      const response = await signUp(full_name, email, password, student_number);

      // Check if signup was successful
      if (response && response.success) {
        navigate("/dashboard"); // ✅ redirect after signup
      } else {
        setError(response?.message || "Sign up failed");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Sign up failed");
    }
  };

  return (
    <div className="center-card slide-up">
      <h1 className="page-title">Create Account</h1>
      <p className="muted">Join the NWU Student Market</p>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Full Name"
          value={full_name}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Student Number"
          value={student_number}
          onChange={(e) => setStudentNumber(e.target.value)}
          required
        />

        {/* Password input */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="show-hide-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="text-xs text-red-600 space-y-1">
          {passwordErrors.length && <p>Password must be at least 6 characters long.</p>}
          {passwordErrors.number && <p>Password must include at least one number.</p>}
        </div>

        {/* Confirm Password input */}
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="show-hide-btn"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? "Hide" : "Show"}
          </button>
        </div>

        <div className="text-xs text-red-600 space-y-1">
          {passwordErrors.match && <p>Passwords do not match.</p>}
        </div>

        <button type="submit" disabled={passwordErrors.length || passwordErrors.number || passwordErrors.match}>
          Sign Up
        </button>
      </form>
    </div>
  );
}
