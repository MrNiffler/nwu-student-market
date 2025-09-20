import { pool } from "../config/db.js";

// Full order history per user
export async function getUserOrderHistory(req, res) {
  try {
    const { userId } = req.params;

    const bookings = await pool.query(
      "SELECT * FROM Bookings WHERE buyer_id = $1 ORDER BY start_time DESC",
      [userId]
    );

    const transactions = await pool.query(
      "SELECT * FROM Transactions WHERE buyer_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    res.json({
      bookings: bookings.rows,
      transactions: transactions.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
