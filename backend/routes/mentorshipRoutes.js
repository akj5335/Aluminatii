import express from 'express';
const router = express.Router();
import { getMentors, requestMentorship } from './controllers/mentorshipController.js';
import auth from '../middleware/authMiddleware.js';

router.get('/mentors', auth, getMentors);
router.post('/request', auth, requestMentorship);

export default router;
