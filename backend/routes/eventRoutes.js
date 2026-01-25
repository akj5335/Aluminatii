import express from 'express';
const router = express.Router();
import { getEvents, createEvent, toggleRSVP } from './controllers/eventController.js';
import auth from '../middleware/authMiddleware.js';

router.get('/', getEvents);
router.post('/', auth, createEvent);
router.post('/:id/rsvp', auth, toggleRSVP);

export default router;
