// src/components/Admin/UserManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function UserManagement() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/users/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${currentUser.token}` } }
      );
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, approved: true } : u))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to approve user");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/users/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${currentUser.token}` } }
      );
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to reject user");
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>
      <table className="w-full border border-gray-300 rounded-md overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Name</th>
            <th className="border p-2 text-left">Email</th>
            <th className="border p-2 text-left">Role</th>
            <th className="border p-2 text-left">Approved</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="border p-2">{u.full_name}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">{u.role}</td>
              <td
                className={`border p-2 font-medium ${
                  u.approved ? "text-green-600" : "text-red-600"
                }`}
              >
                {u.approved ? "Yes" : "No"}
              </td>
              <td className="border p-2 text-center space-x-2">
                {!u.approved && (
                  <>
                    <button
                      onClick={() => handleApprove(u.id)}
                      className="px-3 py-1 rounded-md bg-green-500 hover:bg-green-600 text-white"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(u.id)}
                      className="px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
