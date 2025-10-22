import express from 'express';
import { createUser, getAllUsers } from '../controllers/users.controller.js';

const router = express.Router();

// POST /api/users  -> create a new user
router.post('/', createUser);

// GET /api/users  -> get all users
router.get('/', getAllUsers);

export default router;
