import express from 'express';
import { body } from 'express-validator';
import { register, login, requestPasswordReset, resetPassword } from '../controllers/auth.controller.js';

const router = express.Router();

router.post(
  '/register',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['buyer', 'seller']),
  register
);

router.post(
  '/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  login
);

router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;