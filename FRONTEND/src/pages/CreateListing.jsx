import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./CreateListing.css";

const CreateListing = ({ addNotification = () => {} }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category_id: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Books" },
    { id: 3, name: "Clothing" },
    { id: 4, name: "Furniture" },
    { id: 5, name: "Other" },
  ];

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

    if (!formData.category_id || !formData.title || !formData.description || !formData.price) {
      addNotification("Please fill in all required fields", "error");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("category_id", Number(formData.category_id)); // ensure number
      data.append("type", formData.title); // backend expects "type"
      data.append("description", formData.description);
      data.append("price", Number(formData.price));
      if (formData.image) data.append("image", formData.image);

      const response = await fetch("http://localhost:5000/api/listings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentUser.token}`, // token required
        },
        body: data,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to create listing");
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
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
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
