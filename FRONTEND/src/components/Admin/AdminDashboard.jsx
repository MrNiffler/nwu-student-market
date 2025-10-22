import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { fetchAPI } from "../../api/api";

function AdminDashboard({ addNotification }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch metrics from backend
  const fetchMetrics = async () => {
    try {
      const data = await fetchAPI("admin/metrics"); // Backend endpoint
      setMetrics(data);
    } catch (err) {
      console.error("Error fetching metrics:", err);
      addNotification?.("Failed to load dashboard metrics.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics(); // Initial fetch

    // Set up polling every 10 seconds
    const interval = setInterval(() => {
      fetchMetrics();
    }, 10000); // 10000 ms = 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Map backend keys to user-friendly labels
  const metricLabels = {
    users: "Total Users",
    listings: "Total Listings",
    transactions: "Total Transactions",
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>

      {/* Tabs Navigation */}
      <div className="admin-tabs">
        <NavLink
          to="/admin/analytics"
          className={({ isActive }) => (isActive ? "tab-btn active" : "tab-btn")}
        >
          Analytics
        </NavLink>
        <NavLink
          to="/admin/listings"
          className={({ isActive }) => (isActive ? "tab-btn active" : "tab-btn")}
        >
          Listings
        </NavLink>
        <NavLink
          to="/admin/orders"
          className={({ isActive }) => (isActive ? "tab-btn active" : "tab-btn")}
        >
          Orders
        </NavLink>
        <NavLink
          to="/admin/users"
          className={({ isActive }) => (isActive ? "tab-btn active" : "tab-btn")}
        >
          Users
        </NavLink>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        {loading ? (
          <p>Loading metrics...</p>
        ) : metrics ? (
          Object.entries(metrics).map(([key, value]) => (
            <div key={key} className="metric-card">
              <div className="metric-label">{metricLabels[key] || key}</div>
              <div className="metric-value">{value || 0}</div>
            </div>
          ))
        ) : (
          <p>No metrics available.</p>
        )}
      </div>

      {/* Nested Admin Pages */}
      <div style={{ width: "100%" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default AdminDashboard;
