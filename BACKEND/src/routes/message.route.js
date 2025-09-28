import express from "express";
import { pool } from "../config/db.js";
// import { authMiddleware } from "../middleware/auth.js"; // Uncomment later to restrict access

const router = express.Router();

// Get all conversations for a user (public for now)
// router.get("/conversations/:userId", authMiddleware(), async (req, res) => {
router.get("/conversations/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM Message_Threads
       WHERE buyer_id = $1 OR seller_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all messages in a conversation (still public)
// router.get("/conversations/:conversationId/messages", authMiddleware(), async (req, res) => {
router.get("/conversations/:conversationId/messages", async (req, res) => {
  const { conversationId } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM Messages
       WHERE thread_id = $1
       ORDER BY created_at ASC`,
      [conversationId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
