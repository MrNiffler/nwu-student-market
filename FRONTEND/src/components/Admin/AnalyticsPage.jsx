// src/components/Admin/AnalyticsPage.jsx
import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsPage() {
  const { currentUser } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/listings", {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      setListings(res.data);
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const transactions = listings.reduce((acc, l) => acc + (l.sales || 0), 0);

  const categoryCounts = listings.reduce((acc, item) => {
    const cat = item.category || "Uncategorized";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const barData = {
    labels: listings.map((l) => l.title || "Unknown"),
    datasets: [
      {
        label: "Active Listings",
        data: listings.map((l) => (l.status === "active" ? 1 : 0)),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const pieData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Categories",
        data: Object.values(categoryCounts),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  if (loading) return <p>Loading analytics...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Analytics Dashboard</h1>

      <section style={{ margin: "2rem 0" }}>
        <h2>Metrics</h2>
        <p>Total Listings: {listings.length}</p>
        <p>Total Transactions: {transactions}</p>
      </section>

      <section style={{ margin: "2rem 0" }}>
        <h2>Active Listings</h2>
        <Bar data={barData} />
      </section>

      <section style={{ margin: "2rem 0" }}>
        <h2>Most-Used Categories</h2>
        <Pie data={pieData} />
      </section>
    </div>
  );
}
