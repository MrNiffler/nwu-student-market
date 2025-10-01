import { verifyToken } from '../config/jwt.js';
import pool from '../config/db.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    const result = await pool.query('SELECT id, email, role FROM users WHERE id = $1', [decoded.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.user = result.rows[0];
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};