import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import studentPhoto from "../assets/student-photo.jpg"; // Placeholder photo
import { FaShoppingCart, FaHeart, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import axios from "axios";

function Profile({ cart, wishlist, user }) {
  const studentInfo = {
    name: "Thabo Mokoena",
    role: "Founder & CEO of ThaboTech Solutions",
    businessName: "ThaboTech Solutions",
    about: "ThaboTech Solutions is a student-run tech startup focused on providing affordable web development and digital marketing services to small businesses in Gauteng. Founded in 2024, the company has helped over 30 local entrepreneurs establish their online presence.",
    services: [
      "Website Design & Development",
      "Social Media Management",
      "SEO Optimization",
      "Graphic Design",
    ],
    email: "thabo@thabotech.co.za",
    website: "https://www.thabotech.co.za",
  };

  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingListing, setEditingListing] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", price: "", description: "" });

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/listings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const myListings = res.data.filter((listing) => listing.userId === user.id);
        setUserListings(myListings);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch user listings:", err);
        setLoading(false);
      }
    };
    if (user?.id) fetchUserListings();
  }, [user]);

  const handleDeleteListing = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserListings(userListings.filter((listing) => listing.id !== id));
      alert("Listing deleted successfully.");
    } catch (err) {
      console.error("Failed to delete listing:", err);
      alert("Failed to delete listing.");
    }
  };

  const handleEditClick = (listing) => {
    setEditingListing(listing.id);
    setEditForm({
      title: listing.title,
      price: listing.price,
      description: listing.description || "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `http://localhost:5000/api/listings/${id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserListings(userListings.map((listing) =>
        listing.id === id ? res.data : listing
      ));
      setEditingListing(null);
      alert("Listing updated successfully.");
    } catch (err) {
      console.error("Failed to update listing:", err);
      alert("Failed to update listing.");
    }
  };

  const handleEditCancel = () => setEditingListing(null);

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="hero" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "3rem 1rem" }}>
        <img src={studentPhoto} alt="Student" style={{ width: "120px", borderRadius: "50%" }} />
        <h2 style={{ fontFamily: "Poppins, sans-serif", color: "#6C63FF" }}>{studentInfo.name}</h2>
        <p style={{ color: "#1F2937", fontWeight: "500" }}>{studentInfo.role}</p>
      </section>

      {/* Business Info */}
      <section style={{ backgroundColor: "#EDE9FE", padding: "2rem", borderRadius: "10px", marginBottom: "2rem" }}>
        <h3 style={{ fontFamily: "Poppins, sans-serif", color: "#6C63FF" }}>About the Business</h3>
        <p style={{ color: "#1F2937" }}>{studentInfo.about}</p>
        <h3 style={{ fontFamily: "Poppins, sans-serif", color: "#6C63FF", marginTop: "1.5rem" }}>Services Offered</h3>
        <ul>
          {studentInfo.services.map((service, index) => (
            <li key={index} style={{ color: "#1F2937", marginBottom: "0.5rem" }}>{service}</li>
          ))}
        </ul>
      </section>

      {/* Contact Info */}
      <section style={{ textAlign: "center", marginBottom: "2rem" }}>
        <p>📧 Email: <a href={`mailto:${studentInfo.email}`}>{studentInfo.email}</a></p>
        <p>🌐 Website: <a href={studentInfo.website} target="_blank" rel="noopener noreferrer">{studentInfo.website}</a></p>
      </section>

      {/* Cart & Wishlist Summary */}
      <section className="summary" style={{ marginBottom: "2rem" }}>
        <h3>Quick Links</h3>
        <ul>
          <li><Link to="/cart" className="btn-primary">Go to Cart ({cart?.length || 0})</Link></li>
          <li style={{ marginTop: "0.5rem" }}><Link to="/wishlist" className="btn-primary">Go to Wishlist ({wishlist?.length || 0})</Link></li>
        </ul>
      </section>

      {/* User Listings */}
      <section className="user-listings">
        <h3>Your Listings</h3>
        {loading ? <p>Loading listings...</p> :
          userListings.length === 0 ? <p>You have no listings yet.</p> :
            <div className="products-grid">
              {userListings.map((listing) => (
                <div key={listing.id} className="product-card">
                  {editingListing === listing.id ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        name="title"
                        value={editForm.title}
                        onChange={handleEditChange}
                        placeholder="Title"
                      />
                      <input
                        type="number"
                        name="price"
                        value={editForm.price}
                        onChange={handleEditChange}
                        placeholder="Price"
                      />
                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        placeholder="Description"
                      />
                      <div className="product-actions">
                        <button className="btn-primary" onClick={() => handleEditSave(listing.id)}><FaSave /> Save</button>
                        <button className="btn-secondary" onClick={handleEditCancel}><FaTimes /> Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="product-details">
                        <h4>{listing.title}</h4>
                        <p className="price">R{listing.price}</p>
                        <p>Status: {listing.status || "Active"}</p>
                      </div>
                      <div className="product-actions">
                        <button className="btn-secondary" onClick={() => handleEditClick(listing)}><FaEdit /> Edit</button>
                        <button className="btn-danger" onClick={() => handleDeleteListing(listing.id)}><FaTrash /> Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
        }
      </section>
    </div>
  );
}

export default Profile;
