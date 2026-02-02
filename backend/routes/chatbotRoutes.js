import express from 'express';
const router = express.Router();
import { handleMessage } from './controllers/chatbotController.js';
import auth from '../middleware/authMiddleware.js';

router.post('/query', auth, handleMessage);

export default router;
