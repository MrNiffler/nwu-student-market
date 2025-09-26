import express from 'express';
import { pool } from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';
const router = express.Router();

// Only admin access
router.use(authMiddleware(['admin']));

// GET all users
router.get('/users', async (req, res) => {
  const result = await pool.query('SELECT id, name, email, role FROM users');
  res.json(result.rows);
});

// CHANGE USER ROLE
router.patch('/users/:id/role', async (req, res) => {
  const { role } = req.body;
  await pool.query('UPDATE users SET role=$1 WHERE id=$2', [role, req.params.id]);
  res.json({ message: 'User role updated' });
});

// DELETE USER
router.delete('/users/:id', async (req, res) => {
  await pool.query('DELETE FROM users WHERE id=$1', [req.params.id]);
  res.json({ message: 'User deleted' });
});

export default router;
