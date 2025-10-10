import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./SignUpPage.css";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [student_number, setStudentNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  // Validation state
  const [passwordErrors, setPasswordErrors] = useState({
    length: true,
    number: true,
    match: true,
  });

  // Live validation effect
  useEffect(() => {
    const length = password.length >= 6;
    const number = /\d/.test(password);
    const match = password === confirmPassword && password !== "";
    setPasswordErrors({ length: !length, number: !number, match: !match });
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Prevent submit if there are validation errors
    if (passwordErrors.length || passwordErrors.number || passwordErrors.match) {
      setError("Please fix the errors above before signing up.");
      return;
    }

    try {
      await signUp(full_name, email, password, student_number);
      navigate("/dashboard"); // regular user dashboard
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to sign up");
    }
  };

  return (
    <div className="center-card slide-up">
      <h1 className="page-title">Create Account</h1>
      <p className="muted">Join the NWU Student Market</p>

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
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

        {/* Student Number above passwords */}
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
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2 text-sm text-gray-500"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Password length & number errors below first password */}
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
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-2 top-2 text-sm text-gray-500"
          >
            {showConfirm ? "Hide" : "Show"}
          </button>
        </div>

        {/* Passwords do not match below confirm password */}
        <div className="text-xs text-red-600 space-y-1">
          {passwordErrors.match && <p>Passwords do not match.</p>}
        </div>

        <button type="submit" className="btn btn-primary w-full mt-2">Sign up</button>
      </form>
    </div>
  );
}
