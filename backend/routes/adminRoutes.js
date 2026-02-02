import express from 'express';
const router = express.Router();
import * as adminController from './controllers/adminController.js';
import auth from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

// Get all users (Admin only)
router.get('/users', auth, authorize('admin'), adminController.getUsers);

// Approve/Verify user (Admin only)
router.patch('/verify-user/:id', auth, authorize('admin'), adminController.verifyUser);

// Get stats (Admin only)
router.get('/stats', auth, authorize('admin'), adminController.stats);

export default router;
