import express from "express";
import { pool } from "../config/db.js";
// import { authMiddleware } from "../middleware/auth.js"; // Optional: Enable when needed

const router = express.Router();

/**
 * Get all conversations for a user
 * GET /api/messages/conversations/:userId
 */
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

/**
 * Get all messages in a conversation
 * GET /api/messages/conversations/:conversationId/messages
 */
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

/**
 * Send a message in a conversation
 * POST /api/messages/conversations/:conversationId/messages
 */
router.post("/conversations/:conversationId/messages", async (req, res) => {
  const { conversationId } = req.params;
  const { sender_id, body } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO Messages (thread_id, sender_id, body)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [conversationId, sender_id, body]
    );

    res.status(201).json({
      id: result.rows[0].id,
      thread_id: conversationId,
      sender_id,
      body,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

