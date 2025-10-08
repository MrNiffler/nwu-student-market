// src/components/Admin/ReportedListings.jsx
import React from "react";

const mockReports = [
  { id: 1, listing: "Used Laptop", reason: "Inappropriate image" },
  { id: 2, listing: "Old Books", reason: "Spam listing" },
];

function ReportedListings() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Reported Listings
      </h2>
      <table className="w-full border border-gray-300 rounded-md overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Listing</th>
            <th className="border p-2 text-left">Reason</th>
            <th className="border p-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {mockReports.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="border p-2">{r.listing}</td>
              <td className="border p-2">{r.reason}</td>
              <td className="border p-2 text-center">
                <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md">
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportedListings;
