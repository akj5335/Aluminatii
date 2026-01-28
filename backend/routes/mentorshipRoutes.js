import express from 'express';
const router = express.Router();
import { getMentors, requestMentorship, requestSession, getSessions, updateSessionStatus } from './controllers/mentorshipController.js';
import auth from '../middleware/authMiddleware.js';

router.get('/mentors', auth, getMentors);
router.post('/request', auth, requestMentorship); // Keep legacy generic request if needed

// Session Routes
router.post('/session/request', auth, requestSession);
router.get('/sessions', auth, getSessions);
router.patch('/session/:id', auth, updateSessionStatus);

export default router;
