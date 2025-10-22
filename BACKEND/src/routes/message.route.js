import express from "express";
import { pool } from "../config/db.js";
import { authenticate } from "../middleware/auth.js"; // Ensure this sets req.user

const router = express.Router();

//Get all conversations for the logged-in user
//GET /api/messages/conversations
router.get("/conversations", authenticate, async (req, res) => {
  const userId = req.user.id;
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

  // Get all messages in a conversation
 //GET /api/messages/conversations/:conversationId/messages
router.get("/conversations/:conversationId/messages", authenticate, async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user.id;

  try {
    // Verify user is part of the conversation
    const threadCheck = await pool.query(
      `SELECT * FROM Message_Threads
       WHERE id = $1 AND (buyer_id = $2 OR seller_id = $2)`,
      [conversationId, userId]
    );

    if (threadCheck.rows.length === 0)
      return res.status(403).json({ error: "Not authorized to view this conversation" });

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

// Send a message in a conversation
//POST /api/messages/conversations/:conversationId/messages
router.post("/conversations/:conversationId/messages", authenticate, async (req, res) => {
  const { conversationId } = req.params;
  const { body } = req.body;
  const senderId = req.user.id;

  try {
    // Verify user is part of the conversation
    const threadCheck = await pool.query(
      `SELECT * FROM Message_Threads
       WHERE id = $1 AND (buyer_id = $2 OR seller_id = $2)`,
      [conversationId, senderId]
    );

    if (threadCheck.rows.length === 0)
      return res.status(403).json({ error: "Not authorized to send messages in this conversation" });

    const result = await pool.query(
      `INSERT INTO Messages (thread_id, sender_id, body)
       VALUES ($1, $2, $3)
       RETURNING id, created_at`,
      [conversationId, senderId, body]
    );

    res.status(201).json({
      id: result.rows[0].id,
      thread_id: conversationId,
      sender_id: senderId,
      body,
      created_at: result.rows[0].created_at
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
