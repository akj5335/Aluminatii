import express from 'express';
const router = express.Router();
import { getConversations, getMessages, sendMessage, getUnreadCount, markAsRead } from './controllers/messageController.js';
import auth from '../middleware/authMiddleware.js';

router.get('/conversations', auth, getConversations);
router.get('/unread-count', auth, getUnreadCount);
router.get('/:userId', auth, getMessages);
router.post('/', auth, sendMessage);
router.post('/mark-read', auth, markAsRead);

export default router;
