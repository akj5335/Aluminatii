import express from 'express';
const router = express.Router();
import { getNotifications, markAsRead, markAllAsRead } from './controllers/notificationController.js';
import auth from '../middleware/authMiddleware.js';

router.get('/', auth, getNotifications);
router.patch('/:id/read', auth, markAsRead);
router.patch('/read-all', auth, markAllAsRead);

export default router;
