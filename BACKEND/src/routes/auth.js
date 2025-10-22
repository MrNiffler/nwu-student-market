import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import dotenv from 'dotenv';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

dotenv.config();

const router = express.Router();

// -------------------------
// REGISTER
// -------------------------
router.post('/register', async (req, res) => {
  const { full_name, email, password, student_number, role } = req.body;

  if (!full_name || !email || !password || !student_number) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, student_number, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name, email, student_number, role`,
      [full_name, email, hashedPassword, student_number, role || 'buyer']
    );

    // Sign token immediately
    const token = jwt.sign(
      { id: result.rows[0].id, role: result.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ message: 'User created!', user: result.rows[0], token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------
// LOGIN
// -------------------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing required fields' });

  try {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ message: 'User not found' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(400).json({ message: 'Wrong password' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Logged in!', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------
// USERS /me
// -------------------------
import { authenticate } from '../middleware/auth.js';

router.get('/me', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, full_name, email, role, student_number FROM users WHERE id=$1',
      [req.user.id]
    );
    const user = result.rows[0];
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error fetching /me:', err);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// -------------------------
// FORGOT PASSWORD
// -------------------------
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Missing email' });

  try {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ message: 'User not found' });

    const token = crypto.randomBytes(20).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await pool.query(
      'INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, token, expires]
    );

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `Click this link to reset password: http://localhost:3000/reset-password?token=${token}`
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) console.error(err);
    });

    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------
// RESET PASSWORD
// -------------------------
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ message: 'Missing required fields' });

  try {
    const result = await pool.query(
      'SELECT * FROM password_resets WHERE token=$1 AND expires_at > NOW()',
      [token]
    );

    const reset = result.rows[0];
    if (!reset) return res.status(400).json({ message: 'Invalid or expired token' });

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'UPDATE users SET password_hash=$1 WHERE id=$2',
      [hashedPassword, reset.user_id]
    );

    await pool.query('DELETE FROM password_resets WHERE id=$1', [reset.id]);

    res.json({ message: 'Password has been reset' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
