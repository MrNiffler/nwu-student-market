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

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function AnalyticsPage() {
  const [listings, setListings] = useState([]);
  const [transactions, setTransactions] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/listings");
        const data = await res.json();

        // Validate API response
        if (!Array.isArray(data) || data.length === 0) {
          console.warn("API did not return valid listings, using dummy data.");
          setListings(dummyListings());
          setTransactions(dummyListings().reduce((acc, l) => acc + l.sales, 0));
          return;
        }

        setListings(data);
        setTransactions(data.reduce((acc, l) => acc + (l.sales || 0), 0));
      } catch (err) {
        console.error("Failed to fetch listings:", err);
        // fallback to dummy data
        const dummy = dummyListings();
        setListings(dummy);
        setTransactions(dummy.reduce((acc, l) => acc + l.sales, 0));
      }
    };

    fetchData();
  }, []);

  // Dummy listings in case backend is unavailable
  const dummyListings = () => [
    { id: 1, title: "Laptop", category: "Electronics", status: "active", sales: 5 },
    { id: 2, title: "Phone", category: "Electronics", status: "active", sales: 8 },
    { id: 3, title: "Book", category: "Education", status: "inactive", sales: 3 },
    { id: 4, title: "Headphones", category: "Electronics", status: "active", sales: 2 },
    { id: 5, title: "Notebook", category: "Education", status: "active", sales: 7 },
  ];

  // Calculate most-used categories
  const categoryCounts = Array.isArray(listings)
    ? listings.reduce((acc, item) => {
        const cat = item.category || "Uncategorized";
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {})
    : {};

  const barData = {
    labels: Array.isArray(listings) ? listings.map((l) => l.title || "Unknown") : [],
    datasets: [
      {
        label: "Active Listings",
        data: Array.isArray(listings)
          ? listings.map((l) => (l.status === "active" ? 1 : 0))
          : [],
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
