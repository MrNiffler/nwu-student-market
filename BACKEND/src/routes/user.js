import express from 'express';
import { pool } from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';
const router = express.Router();

// GET current user profile
router.get('/me', authMiddleware(), async (req, res) => {
  const result = await pool.query(
    'SELECT id, full_name, email, role FROM users WHERE id=$1',
    [req.user.id]
  );
  res.json(result.rows[0]);
});

// UPDATE profile
router.patch('/me', authMiddleware(), async (req, res) => {
  const { full_name, email } = req.body;
  await pool.query(
    'UPDATE users SET full_name=$1, email=$2 WHERE id=$3',
    [full_name, email, req.user.id]
  );
  res.json({ message: 'Profile updated' });
});

export default router;
