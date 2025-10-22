import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function TransactionMonitor() {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/transactions", {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) return <p>Loading transactions...</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Transaction & Order Monitoring
      </h2>

      <table className="w-full border border-gray-300 rounded-md overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">Transaction ID</th>
            <th className="border p-2 text-left">Buyer</th>
            <th className="border p-2 text-left">Seller</th>
            <th className="border p-2 text-left">Amount</th>
            <th className="border p-2 text-left">Status</th>
            <th className="border p-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50">
              <td className="border p-2">{t.id}</td>
              <td className="border p-2">{t.buyer_name}</td>
              <td className="border p-2">{t.seller_name}</td>
              <td className="border p-2">R{t.amount}</td>
              <td className="border p-2">
                <span
                  className={`${
                    t.status === "completed"
                      ? "text-green-600"
                      : t.status === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  } font-medium`}
                >
                  {t.status}
                </span>
              </td>
              <td className="border p-2">
                {new Date(t.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
