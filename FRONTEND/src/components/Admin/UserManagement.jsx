// src/components/Admin/UserManagement.jsx
import React from "react";

const mockUsers = [
  { id: 1, name: "Alice Johnson", email: "alice@nwu.ac.za", status: "active" },
  { id: 2, name: "Bob Smith", email: "bob@nwu.ac.za", status: "banned" },
  { id: 3, name: "Carol White", email: "carol@nwu.ac.za", status: "active" },
];

function UserManagement() {
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
          {mockUsers.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="border p-2">{u.name}</td>
              <td className="border p-2">{u.email}</td>
              <td
                className={`border p-2 font-medium ${
                  u.status === "banned" ? "text-red-600" : "text-green-600"
                }`}
              >
                {u.status}
              </td>
              <td className="border p-2 text-center">
                {u.status === "active" ? (
                  <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md">
                    Ban
                  </button>
                ) : (
                  <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md">
                    Unban
                  </button>
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
