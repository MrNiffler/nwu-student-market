import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { products } from "./products.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AnalyticsPage() {
  const [data] = useState(products);

  const productSales = data.reduce((acc, item) => {
    acc[item.name] = (acc[item.name] || 0) + item.sales;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(productSales),
    datasets: [
      {
        label: "Total Sales",
        data: Object.values(productSales),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Data Analytics Dashboard</h1>

      <div style={{ margin: "2rem 0" }}>
        <Bar data={chartData} />
      </div>

      <h2>Data Table</h2>
      <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Sales</th>
            <th>Region</th>
            <th>Month</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.name}</td>
              <td>{d.sales}</td>
              <td>{d.region}</td>
              <td>{d.month}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
