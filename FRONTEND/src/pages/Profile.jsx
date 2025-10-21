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
    // avatar can be: File (when uploading), or string URL/path (when using URL)
    avatar: null,
    avatar_url: "", // text input for avatar URL (optional)
  });
  const [preview, setPreview] = useState(null);

  // Helpers
  const isImageString = (val) => {
    if (!val) return false;
    // blob:, data:, http(s)://, or leading slash for local path like /uploads/...
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
    // If looks like email use part before @
    const base = name.includes("@") ? name.split("@")[0] : name;
    const parts = base.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      const first = parts[0];
      return (first[0] || "").toUpperCase();
    }
    const initials = (parts[0][0] || "") + (parts[parts.length - 1][0] || "");
    return initials.toUpperCase();
  };

  useEffect(() => {
    if (currentUser) {
      setFormData({
        full_name: currentUser.full_name || "",
        email: currentUser.email || "",
        role: currentUser.role || "",
        student_number: currentUser.student_number || "",
        avatar: null,
        avatar_url: typeof currentUser.avatar === "string" ? currentUser.avatar : "",
      });

      // preview: prefer a string avatar; otherwise null so initials render
      const avatarValue = currentUser.avatar || null;
      setPreview(avatarValue);
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file, avatar_url: "" }));
      // create a blob preview
      const blobUrl = URL.createObjectURL(file);
      setPreview(blobUrl);
    } else {
      // text input (avatar_url or other fields)
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (name === "avatar_url") {
        // setting preview immediately if valid-looking URL (user might paste)
        setPreview(value || null);
        // also set avatar to the URL string so handleSave will send it
        setFormData((prev) => ({ ...prev, avatar: value || null, avatar_url: value }));
      }
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // If avatar is a File, backend should handle multipart/form-data file upload.
      // If avatar is a string (URL/path), send that string.
      await updateUser({
        full_name: formData.full_name || currentUser.full_name,
        email: formData.email || currentUser.email,
        student_number: formData.student_number || currentUser.student_number,
        // send either File or string (your updateUser must support both)
        avatar: formData.avatar || (formData.avatar_url ? formData.avatar_url : null),
      });

      setEditing(false);
    } catch (err) {
      alert(err?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return <p>Loading profile...</p>;

  const initials = getInitials(currentUser.full_name || currentUser.email);

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h1>My Profile</h1>

        <div className="profile-picture">
          {/* If preview is an image string (URL/blob/data) show image; otherwise show initials */}
          {isImageString(preview) ? (
            <img src={preview} alt="Profile" className="avatar-img" />
          ) : (
            <div className="initials-avatar" aria-hidden>
              {initials}
            </div>
          )}

          {editing && (
            <div className="avatar-controls">
              <label className="file-label">
                Upload Image
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={handleChange}
                />
              </label>

              <label className="url-label">
                Or paste image URL
                <input
                  type="text"
                  name="avatar_url"
                  placeholder="https://example.com/avatar.jpg"
                  value={formData.avatar_url}
                  onChange={handleChange}
                />
              </label>
            </div>
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
