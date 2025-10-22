// routes/admin.route.js
import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { pool } from '../config/db.js';

const router = express.Router();

// All routes here require admin
router.use(authMiddleware(['admin']));

// GET all users
router.get('/users', async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, full_name, email, role, approved AS status FROM users ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// PATCH user role
router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    await pool.query('UPDATE users SET role=$1 WHERE id=$2', [role, req.params.id]);
    res.json({ message: 'User role updated' });
  } catch (err) {
    console.error('Error updating user role:', err);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// DELETE user
router.delete('/users/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id=$1', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// PATCH approve user
router.patch('/users/:id/approve', async (req, res) => {
  try {
    await pool.query('UPDATE users SET approved = TRUE WHERE id=$1', [req.params.id]);
    res.json({ message: 'User approved' });
  } catch (err) {
    console.error('Error approving user:', err);
    res.status(500).json({ error: 'Failed to approve user' });
  }
});

// PATCH reject user
router.patch('/users/:id/reject', async (req, res) => {
  try {
    await pool.query('UPDATE users SET approved = FALSE WHERE id=$1', [req.params.id]);
    res.json({ message: 'User rejected' });
  } catch (err) {
    console.error('Error rejecting user:', err);
    res.status(500).json({ error: 'Failed to reject user' });
  }
});

export default router;
