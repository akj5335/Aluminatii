import express from 'express';
import { createPitch, getStartups, addFunding } from './controllers/startupController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getStartups);
router.post('/', auth, createPitch);
router.post('/:id/funding', auth, addFunding);

export default router;
