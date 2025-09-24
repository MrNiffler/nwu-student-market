import { pool } from "../config/db.js";

// Get all transactions
export async function getAllTransactions(_req, res) {
  try {
    const result = await pool.query("SELECT * FROM Transactions ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get transaction by ID
export async function getTransaction(req, res) {
  try {
    const result = await pool.query("SELECT * FROM Transactions WHERE id = $1", [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Transaction not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Create transaction
export async function createTransaction(req, res) {
  try {
    const { listing_id, buyer_id, seller_id, amount, status } = req.body;
    const result = await pool.query(
      `INSERT INTO Transactions (listing_id, buyer_id, seller_id, amount, status, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
      [listing_id, buyer_id, seller_id, amount, status || "pending"]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update transaction status
export async function updateTransactionStatus(req, res) {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const result = await pool.query(
      "UPDATE Transactions SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: "Transaction not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Delete transaction (admin/testing)
export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM Transactions WHERE id = $1 RETURNING *", [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Transaction not found" });
    res.json({ message: "Transaction deleted successfully", transaction: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
