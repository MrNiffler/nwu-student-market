import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

const Profile = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    role: "",
    student_number: "",
    avatar_url: "",
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        full_name: currentUser.full_name || "",
        email: currentUser.email || "",
        role: currentUser.role || "",
        student_number: currentUser.student_number || "",
        avatar_url: typeof currentUser.avatar === "string" ? currentUser.avatar : "",
      });
      setPreview(currentUser.avatar || null);
    }
  }, [currentUser]);

  const isImageString = (val) => {
    return (
      typeof val === "string" &&
      (val.startsWith("http://") ||
        val.startsWith("https://") ||
        val.startsWith("data:") ||
        val.startsWith("blob:") ||
        val.startsWith("/"))
    );
  };

  const getInitials = (nameOrEmail) => {
    if (!nameOrEmail) return "";
    const name = nameOrEmail.trim();
    const base = name.includes("@") ? name.split("@")[0] : name;
    const parts = base.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return (parts[0][0] || "").toUpperCase();
    return ((parts[0][0] || "") + (parts[parts.length - 1][0] || "")).toUpperCase();
  };

  if (!currentUser) return <p>Loading profile...</p>;

  const initials = getInitials(currentUser.full_name || currentUser.email);

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h1>My Profile</h1>

        <div className="profile-picture">
          {isImageString(preview) ? (
            <img src={preview} alt="Profile" className="avatar-img" />
          ) : (
            <div className="initials-avatar" aria-hidden>{initials}</div>
          )}
        </div>

        <div className="profile-info">
          <label>Full Name</label>
          <input type="text" value={formData.full_name} disabled />

          <label>Email</label>
          <input type="email" value={formData.email} disabled />

          <label>Role</label>
          <input type="text" value={formData.role} disabled />

          <label>Student Number</label>
          <input type="text" value={formData.student_number} disabled />
        </div>
      </div>
    </div>
  );
};

export default Profile;
