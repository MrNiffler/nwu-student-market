import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import dotenv from 'dotenv';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
dotenv.config();

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
    [name, email, hashedPassword, role || 'buyer']
  );
  res.json({ message: 'User created!', user: result.rows[0] });
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  const user = result.rows[0];
  if (!user) return res.status(400).json({ message: 'User not found' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: 'Wrong password' });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: 'Logged in!', token });
});

// FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  const user = result.rows[0];
  if (!user) return res.status(400).json({ message: 'User not found' });

  const token = crypto.randomBytes(20).toString('hex');
  const expires = new Date(Date.now() + 3600000); // 1 hour
  await pool.query('INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)', [user.id, token, expires]);

  // send email
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
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log(err);
  });

  res.json({ message: 'Password reset email sent' });
});

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  const result = await pool.query('SELECT * FROM password_resets WHERE token=$1 AND expires_at > NOW()', [token]);
  const reset = result.rows[0];
  if (!reset) return res.status(400).json({ message: 'Invalid or expired token' });

  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query('UPDATE users SET password=$1 WHERE id=$2', [hashedPassword, reset.user_id]);
  await pool.query('DELETE FROM password_resets WHERE id=$1', [reset.id]);

  res.json({ message: 'Password has been reset' });
});

export default router;
