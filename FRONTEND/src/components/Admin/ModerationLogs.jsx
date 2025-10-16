// src/components/Admin/ModerationLogs.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

function ModerationLogs() {
  const { currentUser } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/admin/logs", {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        });
        setLogs(res.data);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <p>Loading logs...</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Moderation Logs
      </h2>
      <table className="w-full border border-gray-300 rounded-md overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Action</th>
            <th className="border p-2 text-left">Admin</th>
            <th className="border p-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-gray-50">
              <td className="border p-2">{log.action}</td>
              <td className="border p-2">{log.admin}</td>
              <td className="border p-2">{log.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ModerationLogs;
