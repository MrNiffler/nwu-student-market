import express from "express";
import db from "../config/db.js";

const router = express.Router();

/**
 * Get all conversations for a user
 */
router.get("/conversations/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT * FROM Conversations 
       WHERE user1_id = ? OR user2_id = ?`,
      [userId, userId]
    );
    res.json(rows);
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
    const [rows] = await db.query(
      `SELECT * FROM Messages 
       WHERE conversation_id = ? 
       ORDER BY created_at ASC`,
      [conversationId]
    );
    res.json(rows);
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
    const [result] = await db.query(
      `INSERT INTO Messages (conversation_id, sender_id, body) 
       VALUES (?, ?, ?)`,
      [conversationId, sender_id, body]
    );
    res.status(201).json({ id: result.insertId, conversationId, sender_id, body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
