import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useAuth } from "../../context/AuthContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsPage = () => {
  const { currentUser } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fixed endpoint to match backend
        const res = await axios.get("/api/admin/metrics", {
          headers: { Authorization: `Bearer ${currentUser?.token}` },
        });
        setAnalytics(res.data);
      } catch (err) {
        console.error("Error fetching admin metrics:", err);
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.token) {
      fetchAnalytics();
    }
  }, [currentUser]);

  if (loading) return <div className="p-4">Loading analytics...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!analytics)
    return <div className="p-4 text-gray-500">No analytics data available</div>;

  const chartData = {
    labels: analytics.months || [],
    datasets: [
      {
        label: "Sales",
        data: analytics.sales || [],
        borderColor: "rgba(34,197,94,1)",
        backgroundColor: "rgba(34,197,94,0.2)",
      },
      {
        label: "New Users",
        data: analytics.newUsers || [],
        borderColor: "rgba(59,130,246,1)",
        backgroundColor: "rgba(59,130,246,0.2)",
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <div className="bg-white shadow rounded p-4">
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default AnalyticsPage;
