import express from 'express';
import { authenticate } from '../middleware/auth.js'; // use authenticate middleware
import { pool } from '../config/db.js';

const router = express.Router();

// GET /users/me - any logged-in user
router.get('/me', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, full_name, email, role, student_number FROM users WHERE id=$1',
      [req.user.id]
    );
    const user = result.rows[0];
    res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

export default router;
