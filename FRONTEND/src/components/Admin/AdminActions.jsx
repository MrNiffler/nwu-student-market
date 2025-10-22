import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function AdminActions({ addNotification }) {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  // Fetch existing categories on load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = currentUser?.token;
        const res = await axios.get("http://localhost:5000/api/admin/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    if (currentUser?.token) fetchCategories();
  }, [currentUser]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const token = currentUser?.token;
      await axios.post(
        "http://localhost:5000/api/admin/announcements",
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      addNotification("Announcement sent successfully!", "success");
      setMessage("");
    } catch (err) {
      console.error("Error sending announcement:", err);
      addNotification("Failed to send announcement.", "error");
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const token = currentUser?.token;
      const res = await axios.post(
        "http://localhost:5000/api/admin/categories",
        { name: newCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories((prev) => [...prev, res.data]);
      addNotification(`Category "${newCategory}" added!`, "success");
      setNewCategory("");
    } catch (err) {
      console.error("Error adding category:", err);
      addNotification("Failed to add category.", "error");
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Admin Actions</h2>

      {/* Announcement Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2 text-gray-700">Send Announcement</h3>
        <form onSubmit={handleSend}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border p-3 rounded-md focus:outline-none focus:ring"
            rows={4}
            placeholder="Type a message to send to all users..."
          />
          <button type="submit" className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Send
          </button>
        </form>
      </div>

      {/* Categories Section */}
      <div>
        <h3 className="text-lg font-medium mb-2 text-gray-700">Manage Categories</h3>
        <div className="flex space-x-2 mb-2">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="border p-2 rounded-md flex-grow"
            placeholder="New category name..."
          />
          <button onClick={handleAddCategory} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Add
          </button>
        </div>
        <ul className="list-disc ml-6">
          {categories.map((c, idx) => (
            <li key={idx} className="text-gray-700">{c.name || c}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
