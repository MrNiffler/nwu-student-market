// src/components/Admin/ReportedListings.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function ReportedListings() {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:5000/listings", {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      const reported = res.data.filter((l) => l.reported);
      setReports(reported);
    } catch (err) {
      console.error("Failed to fetch reported listings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const removeListing = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/listings/${id}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to remove listing:", err);
      alert("Failed to remove listing");
    }
  };

  if (loading) return <p>Loading reported listings...</p>;

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
          {reports.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="border p-2">{r.title}</td>
              <td className="border p-2">{r.reportReason || "Reported"}</td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => removeListing(r.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                >
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
