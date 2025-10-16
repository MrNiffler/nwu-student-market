// src/pages/CreateListing.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./CreateListing.css";

const CreateListing = ({ addNotification }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      addNotification("You must be logged in to create a listing", "error");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });

      const response = await fetch("http://localhost:5000/api/listings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: data,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to create listing");
      }

      addNotification("Listing created successfully!", "success");
      navigate("/dashboard");
    } catch (error) {
      addNotification(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-listing-page">
      <div className="create-listing-card">
        <h1>Create New Listing</h1>
        <form onSubmit={handleSubmit} className="create-listing-form">
          <label>Title</label>
          <input
            type="text"
            name="title"
            placeholder="Listing title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            placeholder="Describe your item"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <label>Price (R)</label>
          <input
            type="number"
            name="price"
            placeholder="Price in R"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            <option value="electronics">Electronics</option>
            <option value="books">Books</option>
            <option value="clothing">Clothing</option>
            <option value="furniture">Furniture</option>
            <option value="other">Other</option>
          </select>

          <label>Upload Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />

          {preview && (
            <div className="image-preview">
              <p>Preview:</p>
              <img src={preview} alt="Preview" />
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Listing"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
