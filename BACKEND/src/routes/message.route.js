import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

/**
 * Get all message threads for a user
 */
router.get("/threads/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT * FROM Message_Threads 
       WHERE buyer_id = ? OR seller_id = ?`,
      [userId, userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get all messages in a thread
 */
router.get("/threads/:threadId/messages", async (req, res) => {
  const { threadId } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT * FROM Messages 
       WHERE thread_id = ? 
       ORDER BY created_at ASC`,
      [threadId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Send a message
 */
router.post("/threads/:threadId/messages", async (req, res) => {
  const { threadId } = req.params;
  const { sender_id, body } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO Messages (thread_id, sender_id, body) 
       VALUES (?, ?, ?)`,
      [threadId, sender_id, body]
    );
    res.status(201).json({ id: result.insertId, threadId, sender_id, body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
