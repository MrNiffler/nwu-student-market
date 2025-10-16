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
      const res = await axios.get("http://localhost:5000/users/", {
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

  const toggleBan = async (user) => {
    try {
      await axios.post(
        `http://localhost:5000/admin/manage-user/${user.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }
      );
      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? { ...u, status: u.status === "active" ? "banned" : "active" }
            : u
        )
      );
    } catch (err) {
      console.error("Failed to manage user:", err);
      alert("Failed to update user status");
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        User Management
      </h2>
      <table className="w-full border border-gray-300 rounded-md overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Name</th>
            <th className="border p-2 text-left">Email</th>
            <th className="border p-2 text-left">Status</th>
            <th className="border p-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="border p-2">{u.full_name}</td>
              <td className="border p-2">{u.email}</td>
              <td
                className={`border p-2 font-medium ${
                  u.status === "banned" ? "text-red-600" : "text-green-600"
                }`}
              >
                {u.status}
              </td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => toggleBan(u)}
                  className={`px-3 py-1 rounded-md text-white ${
                    u.status === "active"
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {u.status === "active" ? "Ban" : "Unban"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
