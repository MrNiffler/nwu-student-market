import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./SignUpPage.css";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [student_number, setStudentNumber] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp(full_name, email, password, student_number);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="center-card slide-up">
      <h1 className="page-title">Create Account</h1>
      <p className="muted">Join the NWU Student Market</p>

      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Full Name" value={full_name} onChange={(e) => setFullName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="text" placeholder="Student Number" value={student_number} onChange={(e) => setStudentNumber(e.target.value)} required />
        <button type="submit" className="btn btn-primary">Sign up</button>
      </form>

      {/* ----------------------------
          Original OAuth link (commented out)
      ---------------------------- */}
      {/*
      <a href={oauthLink} className="btn btn-primary">
        Sign up with NWU
      </a>
      */}
    </div>
  );
}
