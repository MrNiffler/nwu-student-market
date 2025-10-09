// src/pages/Profile.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Profile({ cart, wishlist }) {
  const { currentUser, signOut } = useAuth();

  if (!currentUser) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  const { full_name, email, role } = currentUser;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-2">Welcome, {full_name} 👋</h2>
      <p className="text-gray-600 mb-4">
        <strong>Email:</strong> {email} <br />
        <strong>Role:</strong> {role}
      </p>

      {/* --- ROLE SPECIFIC SECTIONS --- */}
      {role === "admin" && (
        <div>
          <h3 className="text-xl font-semibold mb-2 text-blue-700">Admin Dashboard</h3>
          <p className="text-gray-700 mb-3">
            You have full control over all listings, analytics, and user management.
          </p>
          <Link
            to="/admin"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Go to Admin Dashboard
          </Link>
        </div>
      )}

      {role === "buyer" && (
        <div>
          <h3 className="text-xl font-semibold mb-2 text-green-700">Buyer Profile</h3>
          <p className="text-gray-700 mb-3">
            You can manage your wishlist, view cart items, and check out securely.
          </p>

          <div className="flex space-x-3">
            <Link to="/cart" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              View Cart ({cart.length})
            </Link>
            <Link
              to="/wishlist"
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded"
            >
              Wishlist ({wishlist.length})
            </Link>
          </div>
        </div>
      )}

      {role === "seller" && (
        <div>
          <h3 className="text-xl font-semibold mb-2 text-orange-700">Seller Dashboard</h3>
          <p className="text-gray-700 mb-3">
            You can manage your listings and view buyer activity.
          </p>
          <Link
            to="/marketplace"
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
          >
            Manage Listings
          </Link>
        </div>
      )}

      <hr className="my-6" />

      <button
        onClick={signOut}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
      >
        Sign Out
      </button>
    </div>
  );
}
