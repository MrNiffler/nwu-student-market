// src/components/Admin/ModerationLogs.jsx
import React from "react";

const mockLogs = [
  { id: 1, action: "Removed Listing", admin: "Admin1", date: "2025-10-01" },
  { id: 2, action: "Banned User", admin: "Admin2", date: "2025-10-03" },
  { id: 3, action: "Reviewed Report", admin: "Admin1", date: "2025-10-05" },
];

function ModerationLogs() {
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
          {mockLogs.map((log) => (
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
