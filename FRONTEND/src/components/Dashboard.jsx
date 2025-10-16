// src/components/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css"; // Ensure this CSS file exists

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome, {currentUser?.full_name}</h1>
      <p className="dashboard-subtitle">
        Here is your dashboard for the NWU Student Market.
      </p>

      <div className="dashboard-cards">
        {/* Profile Card */}
        <div className="card">
          <h2>Profile Info</h2>
          <p><strong>Email:</strong> {currentUser?.email}</p>
          <p><strong>Student Number:</strong> {currentUser?.student_number}</p>
          <p><strong>Role:</strong> {currentUser?.role}</p>
        </div>

        {/* Actions Card */}
        <div className="card">
          <h2>Actions</h2>
          <button
            className="btn"
            onClick={() => navigate("/create-listing")}
          >
            Create New Listing
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
