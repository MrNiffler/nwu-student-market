import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./CreateListing.css";

const CreateListing = ({ addNotification = () => {} }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    description: "",
    price: "",
    category_id: "",
    type: "",
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

  if (!formData.type || !formData.description || !formData.price) {
    addNotification(
      "Please fill in all required fields (type, description, price)",
      "error"
    );
    return;
  }

  try {
    setLoading(true);

    let response;
    const token = currentUser.token;

    if (formData.image) {
      // Use FormData if there's an image
      const data = new FormData();
      data.append("type", formData.type);
      data.append("description", formData.description);
      data.append("price", parseFloat(formData.price));
      data.append("category_id", formData.category_id ? Number(formData.category_id) : null);
      data.append("image", formData.image);

      response = await fetch("http://localhost:5000/api/listings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });
    } else {
      // Use JSON if no image
      const payload = {
        type: formData.type,
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: formData.category_id ? Number(formData.category_id) : null,
      };

      response = await fetch("http://localhost:5000/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
    }

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to create listing");

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
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Describe your item or service"
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

          <label>Category (optional)</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <label>Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">Select type</option>
            <option value="product">Product</option>
            <option value="service">Service</option>
          </select>

          <label>Upload Image (optional)</label>
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
