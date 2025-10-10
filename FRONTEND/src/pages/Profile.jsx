import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUser, updateUser } from "../api/api.js";

const demoProfiles = {
  "admin@nwu.ac.za": {
    full_name: "Demo Admin",
    email: "admin@nwu.ac.za",
    role: "admin",
  },
  "buyer@nwu.ac.za": {
    full_name: "Demo Buyer",
    email: "buyer@nwu.ac.za",
    role: "buyer",
  },
  "seller@nwu.ac.za": {
    full_name: "Demo Seller",
    email: "seller@nwu.ac.za",
    role: "seller",
  },
};

export default function Profile() {
  const { currentUser, signOut } = useAuth();
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;
      try {
        const res = await getUser(); // backend endpoint
        setProfile(res);
      } catch (err) {
        console.error(err);
        // Use demo profile fallback
        const demo = demoProfiles[currentUser?.email] || {
          full_name: "Demo User",
          email: currentUser?.email || "demo@nwu.ac.za",
          role: "buyer",
        };
        setProfile(demo);
        setMessage("Backend unavailable, using demo profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [currentUser]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setMessage("");
    try {
      await updateUser({
        full_name: profile.full_name,
        email: profile.email,
      });
      setMessage("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to update profile");
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
            message.includes("demo")
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </p>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          Welcome, {profile.full_name} 👋
        </h2>
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

      <button
        onClick={signOut}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
      >
        Sign Out
      </button>
    </div>
  );
}
