import { body, validationResult } from 'express-validator';
import { createUser, findUserByEmail } from '../models/User.js';
import { generateToken } from '../config/jwt.js';
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, role = 'buyer' } = req.body;
  if (!['buyer', 'seller'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role. Only buyer/seller allowed.' });
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const user = await createUser(email, password, role);
  const token = generateToken(user.id, user.role);
  res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role } });
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user.id, user.role);
  res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
};

// Simplified password reset (no email)
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await findUserByEmail(email);
  if (!user) return res.status(404).json({ message: 'Email not found' });
  // In real app: generate token, email it
  res.json({ message: 'Password reset instructions sent (check console)' });
};

export const resetPassword = async (req, res) => {
  res.json({ message: 'Password reset endpoint ready' });
};