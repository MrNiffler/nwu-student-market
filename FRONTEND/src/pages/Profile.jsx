// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = ({ cart = [], wishlist = [] }) => {
  const navigate = useNavigate();
  const { currentUser, signOut, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    role: "",
    student_number: "",
    avatar: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        full_name: currentUser.full_name || "",
        email: currentUser.email || "",
        role: currentUser.role || "",
        student_number: currentUser.student_number || "",
        avatar: null,
      });
      setPreview(currentUser.avatar || "/uploads/default-avatar.png");
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Send all required fields to backend to prevent NOT NULL errors
      await updateUser({
        full_name: formData.full_name || currentUser.full_name,
        email: formData.email || currentUser.email,
        student_number: formData.student_number || currentUser.student_number,
        avatar: formData.avatar,
      });

      setEditing(false);
    } catch (err) {
      alert(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return <p>Loading profile...</p>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h1>My Profile</h1>

        <div className="profile-picture">
          <img src={preview} alt="Profile" />
          {editing && (
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleChange}
            />
          )}
        </div>

        <div className="profile-info">
          <label>Full Name</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            disabled={!editing}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!editing}
          />

          <label>Role</label>
          <input type="text" value={formData.role} disabled />

          <label>Student Number</label>
          <input
            type="text"
            name="student_number"
            value={formData.student_number}
            onChange={handleChange}
            disabled={!editing}
          />

          {editing ? (
            <button
              className="save-btn"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          ) : (
            <button className="edit-btn" onClick={() => setEditing(true)}>
              Edit Info
            </button>
          )}

          <button className="signout-btn" onClick={() => signOut()}>
            Sign Out
          </button>
        </div>

        {/* Role-specific sections */}
        <div className="role-section">
          {currentUser?.role === "admin" && (
            <div>
              <h2>Admin Panel</h2>
              <button onClick={() => navigate("/admin")}>Go to Dashboard</button>
            </div>
          )}

          {currentUser?.role === "buyer" && (
            <div>
              <h2>My Buyer Info</h2>
              <p>Cart Items: {cart.length}</p>
              <p>Wishlist Items: {wishlist.length}</p>
              <button onClick={() => navigate("/cart")}>Go to Cart</button>
              <button onClick={() => navigate("/wishlist")}>Go to Wishlist</button>
            </div>
          )}

          {currentUser?.role === "seller" && (
            <div>
              <h2>My Listings</h2>
              <button onClick={() => navigate("/dashboard")}>Manage Listings</button>
              <button onClick={() => navigate("/create-listing")}>Create New Listing</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
