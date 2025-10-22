import express from 'express';
import { pool } from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';
const router = express.Router();

// Only admin access
router.use(authMiddleware(['admin']));

// -------------------------
// USER MANAGEMENT
// -------------------------
router.get('/users', async (req, res) => {
  try {
    // Updated to use "status" instead of "approved"
    const result = await pool.query('SELECT id, full_name, email, role, status FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    await pool.query('UPDATE users SET role=$1 WHERE id=$2', [role, req.params.id]);
    res.json({ message: 'User role updated' });
  } catch (err) {
    console.error('Error updating user role:', err);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id=$1', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// ✅ Fixed routes to use "status" instead of "approved"
router.patch('/users/:id/approve', async (req, res) => {
  try {
    await pool.query('UPDATE users SET status = $1 WHERE id=$2', ['active', req.params.id]);
    res.json({ message: 'User approved' });
  } catch (err) {
    console.error('Error approving user:', err);
    res.status(500).json({ error: 'Failed to approve user' });
  }
});

router.patch('/users/:id/reject', async (req, res) => {
  try {
    await pool.query('UPDATE users SET status = $1 WHERE id=$2', ['inactive', req.params.id]);
    res.json({ message: 'User rejected' });
  } catch (err) {
    console.error('Error rejecting user:', err);
    res.status(500).json({ error: 'Failed to reject user' });
  }
});

router.post('/users/:id/report', async (req, res) => {
  try {
    const { reason } = req.body || { reason: 'No reason provided' };
    await pool.query(
      'INSERT INTO user_reports (reported_user_id, admin_id, reason, created_at) VALUES ($1, $2, $3, NOW())',
      [req.params.id, req.user.id, reason]
    );
    res.json({ message: 'User reported successfully' });
  } catch (err) {
    console.error('Error reporting user:', err);
    res.status(500).json({ error: 'Failed to report user' });
  }
});

// -------------------------
// METRICS
// -------------------------
router.get('/metrics', async (req, res) => {
  try {
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    const listingsCount = await pool.query('SELECT COUNT(*) FROM listings');
    const transactionsCount = await pool.query('SELECT COUNT(*) FROM transactions');

    res.json({
      users: parseInt(usersCount.rows[0].count),
      listings: parseInt(listingsCount.rows[0].count),
      transactions: parseInt(transactionsCount.rows[0].count),
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// -------------------------
// LISTING MANAGEMENT
// -------------------------
router.get('/listings', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        l.id, 
        l.seller_id, 
        l.category_id, 
        l.type, 
        l.description AS title, 
        l.price, 
        l.status, 
        u.full_name AS seller_name, 
        c.name AS category
      FROM listings l
      LEFT JOIN users u ON l.seller_id = u.id
      LEFT JOIN categories c ON l.category_id = c.id
      ORDER BY l.id DESC
    `);
    res.json({ data: result.rows });
  } catch (err) {
    console.error('Error fetching listings:', err);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

router.patch('/listings/:id/approve', async (req, res) => {
  try {
    await pool.query('UPDATE listings SET status = $1 WHERE id=$2', ['active', req.params.id]);
    res.json({ message: 'Listing approved' });
  } catch (err) {
    console.error('Error approving listing:', err);
    res.status(500).json({ error: 'Failed to approve listing' });
  }
});

router.patch('/listings/:id/reject', async (req, res) => {
  try {
    await pool.query('UPDATE listings SET status = $1 WHERE id=$2', ['inactive', req.params.id]);
    res.json({ message: 'Listing rejected' });
  } catch (err) {
    console.error('Error rejecting listing:', err);
    res.status(500).json({ error: 'Failed to reject listing' });
  }
});

router.delete('/listings/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM listings WHERE id=$1', [req.params.id]);
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    console.error('Error deleting listing:', err);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

// -------------------------
// TRANSACTIONS / ORDERS
// -------------------------
router.get('/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions ORDER BY created_at DESC');
    res.json({ data: result.rows });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

export default router;
