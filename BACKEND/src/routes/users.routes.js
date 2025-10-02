import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getProfile } from '../controllers/users.controller.js';

const router = express.Router();

router.get('/profile', authenticate, getProfile);

export default router;