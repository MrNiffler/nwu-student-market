// src/components/Admin/AdminDashboard.jsx
import React, { useState } from "react";
import ReportedListings from "./ReportedListings";
import UserManagement from "./UserManagement";
import ModerationLogs from "./ModerationLogs";
import AnalyticsPage from "./AnalyticsPage"; // ✅ Import the analytics component

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("reports");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 mb-4">
        <button
          onClick={() => setActiveTab("reports")}
          className={`px-4 py-2 rounded ${
            activeTab === "reports" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Reported Listings
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded ${
            activeTab === "users" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          User Management
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`px-4 py-2 rounded ${
            activeTab === "logs" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Moderation Logs
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 rounded ${
            activeTab === "analytics" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Analytics
        </button>
      </div>

      {/* Render the selected tab */}
      <div>
        {activeTab === "reports" && <ReportedListings />}
        {activeTab === "users" && <UserManagement />}
        {activeTab === "logs" && <ModerationLogs />}
        {activeTab === "analytics" && <AnalyticsPage />} {/* ✅ Added */}
      </div>
    </div>
  );
}

export default AdminDashboard;
