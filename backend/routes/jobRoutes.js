import express from 'express';
const router = express.Router();
import { getJobs, createJob, deleteJob, getRecommendedJobs } from './controllers/jobController.js';
import auth from '../middleware/authMiddleware.js';

router.get('/', getJobs);
router.get('/recommended', auth, getRecommendedJobs);
router.post('/', auth, createJob);
router.delete('/:id', auth, deleteJob);

export default router;
