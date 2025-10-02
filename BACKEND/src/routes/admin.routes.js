import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';
import { getAllUsers, approveUser, rejectUser } from '../controllers/admin.controller.js';

const router = express.Router();

router.use(authenticate, authorizeRoles('admin'));

router.get('/users', getAllUsers);
router.patch('/users/:id/approve', approveUser);
router.patch('/users/:id/reject', rejectUser);

export default router;