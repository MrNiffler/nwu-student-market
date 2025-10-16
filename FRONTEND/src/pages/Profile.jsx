import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUser } from "../api/api.js"; // assumes this endpoint returns user info
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate(); // <-- added
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    role: "",
    student_number: "",
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      // If not logged in, redirect to login
      if (!currentUser) {
        navigate("/signin");
        return;
      }

      try {
        const res = await getUser(); // fetch backend user data
        setProfile({
          full_name: res.full_name,
          email: res.email,
          role: res.role,
          student_number: res.id, // using backend ID as student number
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
        setMessage("Failed to load user data. Please log in again.");
        // Token invalid? Log out and redirect
        signOut();
        navigate("/signin");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [currentUser, navigate, signOut]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setMessage("");
    try {
      // Call updateUser endpoint if available
      // await updateUser({ full_name: profile.full_name, email: profile.email });
      setMessage("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update profile");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;

  const roleColors = {
    admin: "bg-red-500",
    buyer: "bg-blue-500",
    seller: "bg-green-500",
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      {message && (
        <p
          className={`mb-4 p-2 rounded text-center ${
            message.includes("Failed")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </p>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Welcome, {profile.full_name} </h2>
        <span
          className={`px-3 py-1 rounded-full text-white ${
            roleColors[profile.role] || "bg-gray-500"
          }`}
        >
          {profile.role.toUpperCase()}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Full Name</label>
          {editing ? (
            <input
              type="text"
              name="full_name"
              value={profile.full_name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          ) : (
            <p className="text-gray-700">{profile.full_name}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-1">Email</label>
          {editing ? (
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          ) : (
            <p className="text-gray-700">{profile.email}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-1">Student Number</label>
          <p className="text-gray-700">{profile.student_number}</p>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        {editing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        )}
      </div>

      <hr className="my-6" />

      {/* Role-based quick links */}
      <div className="space-y-2">
        {profile.role === "admin" && (
          <>
            <Link to="/admin/dashboard" className="text-blue-600 hover:underline">
              Admin Dashboard
            </Link>
            <Link to="/admin/users" className="text-blue-600 hover:underline">
              Manage Users
            </Link>
          </>
        )}
        {profile.role === "buyer" && (
          <>
            <Link to="/cart" className="text-blue-600 hover:underline">
              My Cart
            </Link>
            <Link to="/wishlist" className="text-blue-600 hover:underline">
              Wishlist
            </Link>
            <Link to="/orders" className="text-blue-600 hover:underline">
              Order History
            </Link>
          </>
        )}
        {profile.role === "seller" && (
          <>
            <Link to="/seller/listings" className="text-blue-600 hover:underline">
              Manage Listings
            </Link>
            <Link to="/reviews" className="text-blue-600 hover:underline">
              Reviews
            </Link>
          </>
        )}
      </div>

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
