import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./SignUpPage.css";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleDummySignUp = async () => {
    try {
      // Dummy login user
      await signIn("dummy@student.nwu.ac.za", "dummyPassword");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Sign up failed");
    }
  };

  return (
    <div className="center-card slide-up">
      <h1 className="page-title">Create Account</h1>
      <p className="muted">Join the NWU Student Market</p>

      <button onClick={handleDummySignUp} className="btn btn-primary">
        Sign up with Dummy User
      </button>

      <div className="spacer" />
      <div className="row">
        <span className="muted">Already have an account?</span>
        <button onClick={handleDummySignUp} className="btn btn-link">
          Sign in with Dummy User
        </button>
      </div>
    </div>
  );
}
