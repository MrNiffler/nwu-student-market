import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(false);

  // Redirect admins automatically
  useEffect(() => {
    if (currentUser?.role === "admin") {
      navigate("/admin");
    }
  }, [currentUser, navigate]);

  // Fetch buyer's listings
  useEffect(() => {
    const fetchListings = async () => {
      if (currentUser?.role !== "buyer") return;
      try {
        setLoadingListings(true);
        const res = await fetch(
          `http://localhost:5000/api/listings/user/${currentUser.id}`,
          {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          }
        );

        if (res.status === 404) {
          // No listings yet
          setListings([]);
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch listings");

        const data = await res.json();
        setListings(data || []);
      } catch (err) {
        console.error("Error fetching listings:", err);
        setListings([]); // fallback to empty array
      } finally {
        setLoadingListings(false);
      }
    };
    fetchListings();
  }, [currentUser]);

  if (!currentUser) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard-container">
      <h1>Welcome, {currentUser.full_name}</h1>
      <p>Here is your dashboard for the NWU Student Market.</p>

      {/* Profile Info */}
      <div className="dashboard-cards">
        <div className="card">
          <h2>Profile Info</h2>
          <p><strong>Email:</strong> {currentUser.email}</p>
          <p><strong>Student Number:</strong> {currentUser.student_number}</p>
          <p><strong>Role:</strong> {currentUser.role}</p>
        </div>
      </div>

      {/* Buyer Actions */}
      {currentUser.role === "buyer" && (
        <div className="card">
          <h2>Actions</h2>
          <button onClick={() => navigate("/cart")}>Go to Cart</button>
          <button onClick={() => navigate("/wishlist")}>Go to Wishlist</button>
          <button onClick={() => navigate("/create-listing")}>Create New Listing</button>
        </div>
      )}

      {/* Buyer Listings */}
      {currentUser.role === "buyer" && (
        <div className="listings-section">
          <h2>My Listings</h2>
          {loadingListings ? (
            <p>Loading listings...</p>
          ) : listings.length === 0 ? (
            <p>No listings yet.</p>
          ) : (
            <ul>
              {listings.map((l) => (
                <li key={l.id}>
                  <strong>{l.description}</strong> - R{l.price} ({l.type})
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
