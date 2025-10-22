import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./adminstyle.css"; // make sure to import the new CSS

const AdminListingsPage = () => {
  const { currentUser } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchListings = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/listings", {
        headers: { Authorization: `Bearer ${currentUser?.token}` },
      });
      setListings(response.data.data || []);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  const approveListing = async (id) => {
    await axios.patch(
      `http://localhost:5000/api/admin/listings/${id}/approve`,
      {},
      { headers: { Authorization: `Bearer ${currentUser?.token}` } }
    );
    fetchListings();
  };

  const rejectListing = async (id) => {
    await axios.patch(
      `http://localhost:5000/api/admin/listings/${id}/reject`,
      {},
      { headers: { Authorization: `Bearer ${currentUser?.token}` } }
    );
    fetchListings();
  };

  const deleteListing = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this listing?");
    if (!confirmDelete) return;

    await axios.delete(`http://localhost:5000/api/admin/listings/${id}`, {
      headers: { Authorization: `Bearer ${currentUser?.token}` },
    });
    fetchListings();
  };

  useEffect(() => {
    if (currentUser?.token) fetchListings();
  }, [currentUser]);

  if (loading) return <p>Loading listings...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Listings</h1>

      {listings.length === 0 ? (
        <p>No listings found.</p>
      ) : (
        <div className="listings-grid">
          {listings.map((listing) => (
            <div key={listing.id} className="listing-card">
              <h2 className="listing-title">{listing.title}</h2>
              <p className="listing-category">{listing.category || "Uncategorized"}</p>
              <p className="listing-seller">Seller: {listing.seller_name}</p>
              <p className="listing-price">R {listing.price}</p>
              <div className="action-buttons">
                {listing.status !== "active" && (
                  <button className="btn-approve" onClick={() => approveListing(listing.id)}>
                    Approve
                  </button>
                )}
                {listing.status === "active" && (
                  <button className="btn-reject" onClick={() => rejectListing(listing.id)}>
                    Reject
                  </button>
                )}
                <button className="btn-delete" onClick={() => deleteListing(listing.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminListingsPage;
