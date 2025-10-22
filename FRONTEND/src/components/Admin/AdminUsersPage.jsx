import React, { useEffect, useState } from "react";
import "../Admin/adminstyle.css";
import { getAllUsers, approveUser, rejectUser, deleteUser } from "../../api/api.js";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch users from backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      console.log("Fetched users:", res);
      setUsers(res || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Approve user
  const handleApprove = async (userId) => {
    try {
      await approveUser(userId);
      fetchUsers(); // refresh list
    } catch (err) {
      console.error("Error approving user:", err);
    }
  };

  // Reject user
  const handleReject = async (userId) => {
    try {
      await rejectUser(userId);
      fetchUsers(); // refresh list
    } catch (err) {
      console.error("Error rejecting user:", err);
    }
  };

  // Delete user
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(userId);
      fetchUsers(); // refresh list
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // Filter users based on search input
  const filteredUsers = Array.isArray(users)
    ? users.filter(
        (user) =>
          user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
          user.email?.toLowerCase().includes(search.toLowerCase()) ||
          user.status?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin Users</h2>

      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
        style={{
          padding: "0.5rem 1rem",
          marginBottom: "1rem",
          width: "100%",
          maxWidth: "400px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
        }}
      />

      <div className="table-container admin-users-container">
        {loading ? (
          <p className="loading">Loading users...</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user.id || index}>
                    <td>{index + 1}</td>
                    <td>{user.full_name || "N/A"}</td>
                    <td>{user.email || "N/A"}</td>
                    <td>
                      <span
                        className={
                          user.status === "active"
                            ? "status-approved"
                            : user.status === "inactive"
                            ? "status-rejected"
                            : "status-pending"
                        }
                      >
                        {user.status || "N/A"}
                      </span>
                    </td>
                    <td className="action-buttons">
                      <button className="btn-approve" onClick={() => handleApprove(user.id)}>
                        Approve
                      </button>
                      <button className="btn-reject" onClick={() => handleReject(user.id)}>
                        Reject
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(user.id)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
