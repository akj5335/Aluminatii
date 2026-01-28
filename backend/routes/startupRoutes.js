import express from 'express';
import { createPitch, getStartups } from './controllers/startupController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getStartups);
router.post('/', auth, createPitch);

export default router;
