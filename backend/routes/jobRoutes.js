import express from 'express';
const router = express.Router();
import { getJobs, createJob, deleteJob, getRecommendedJobs } from './controllers/jobController.js';
import { applyToJob, getMyApplications, getJobApplications, updateApplicationStatus } from './controllers/applicationController.js';
import auth from '../middleware/authMiddleware.js';

router.get('/', getJobs);
router.get('/recommended', auth, getRecommendedJobs);
router.get('/applications', auth, getMyApplications); // Get my applications
router.get('/:id/applications', auth, getJobApplications); // Get applicants for a job

router.post('/', auth, createJob);
router.post('/:id/apply', auth, applyToJob); // Apply to job
router.patch('/applications/:id', auth, updateApplicationStatus); // Update status

router.delete('/:id', auth, deleteJob);

export default router;
