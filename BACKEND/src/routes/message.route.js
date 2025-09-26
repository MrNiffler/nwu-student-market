import express from "express";
import { pool } from "../config/db.js"; // Postgres pool

const router = express.Router();

/**
 * Get all conversations for a user
 */
router.get("/conversations/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM Conversations 
       WHERE user1_id = $1 OR user2_id = $2`,
      [userId, userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get all messages in a conversation
 */
router.get("/conversations/:conversationId/messages", async (req, res) => {
  const { conversationId } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM Messages 
       WHERE conversation_id = $1 
       ORDER BY created_at ASC`,
      [conversationId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Send a message
 */
router.post("/conversations/:conversationId/messages", async (req, res) => {
  const { conversationId } = req.params;
  const { sender_id, body } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO Messages (conversation_id, sender_id, body) 
       VALUES ($1, $2, $3) RETURNING id`,
      [conversationId, sender_id, body]
    );
    res.status(201).json({ id: result.rows[0].id, conversationId, sender_id, body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

