import express from 'express';
const router = express.Router();
import * as connectionController from './controllers/connectionController.js';
import auth from '../middleware/authMiddleware.js';

router.post('/request', auth, connectionController.requestConnection);
router.post('/respond', auth, connectionController.respond);
router.get('/', auth, connectionController.getConnections);
router.get('/recommendations', auth, connectionController.getRecommendations);

export default router;
