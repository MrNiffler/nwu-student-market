import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import "./adminstyle.css"; // Import the CSS file

const AdminOrdersPage = ({ metrics }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/orders", {
        headers: { Authorization: `Bearer ${currentUser?.token}` },
      });
      setOrders(res.data.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const approveOrder = async (id) => {
    if (!window.confirm("Are you sure you want to approve this order?")) return;
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/orders/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${currentUser?.token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error("Error approving order:", err);
    }
  };

  const rejectOrder = async (id) => {
    if (!window.confirm("Are you sure you want to reject this order?")) return;
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/orders/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${currentUser?.token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error("Error rejecting order:", err);
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/orders/${id}`, {
        headers: { Authorization: `Bearer ${currentUser?.token}` },
      });
      fetchOrders();
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  useEffect(() => {
    if (currentUser?.token) fetchOrders();
  }, [currentUser]);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_amount), 0);

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "status-approved";
      case "pending":
        return "status-pending";
      case "rejected":
        return "status-rejected";
      default:
        return "status-default";
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Orders</h1>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button onClick={() => navigate("/admin/listings")} className="tab-btn">
          Listings
        </button>
        <button onClick={() => navigate("/admin/orders")} className="tab-btn active">
          Orders
        </button>
        <button onClick={() => navigate("/admin/users")} className="tab-btn">
          Users
        </button>
        <button onClick={() => navigate("/admin/analytics")} className="tab-btn">
          Analytics
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card" onClick={() => navigate("/admin/analytics")}>
          <h2 className="metric-label">Total Orders</h2>
          <p className="metric-value">{metrics?.transactions || orders.length}</p>
        </div>
        <div className="metric-card" onClick={() => navigate("/admin/analytics")}>
          <h2 className="metric-label">Total Revenue</h2>
          <p className="metric-value">R {metrics?.totalRevenue || totalRevenue}</p>
        </div>
      </div>

      {/* Orders Table */}
      <h2 className="orders-title">Orders List</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Buyer</th>
                <th>Listing</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.buyer_name}</td>
                  <td>{order.listing_title}</td>
                  <td>R {order.total_amount}</td>
                  <td className={getStatusColor(order.status)}>{order.status}</td>
                  <td className="action-buttons">
                    {order.status === "pending" && (
                      <>
                        <button onClick={() => approveOrder(order.id)} className="btn-approve">
                          Approve
                        </button>
                        <button onClick={() => rejectOrder(order.id)} className="btn-reject">
                          Reject
                        </button>
                      </>
                    )}
                    <button onClick={() => deleteOrder(order.id)} className="btn-delete">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
