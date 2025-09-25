import pool from '../config/db.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export const createUser = async (email, password, role = 'buyer') => {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const query = `
    INSERT INTO users (email, password_hash, role)
    VALUES ($1, $2, $3)
    RETURNING id, email, role;
  `;
  const res = await pool.query(query, [email, hash, role]);
  return res.rows[0];
};

export const findUserByEmail = async (email) => {
  const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0] || null;
};

export const findUserById = async (id) => {
  const res = await pool.query('SELECT id, email, role FROM users WHERE id = $1', [id]);
  return res.rows[0] || null;
};

export const updateUserApproval = async (id, isApproved) => {
  await pool.query('UPDATE users SET is_approved = $1 WHERE id = $2', [isApproved, id]);
};

export const getAllUsers = async () => {
  const res = await pool.query('SELECT id, email, role, is_approved FROM users');
  return res.rows;
};