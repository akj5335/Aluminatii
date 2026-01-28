const express = require('express');
const router = express.Router();
const connectionController = require('../controllers/connectionController');
const auth = require('../middleware/authMiddleware');

router.post('/request', auth, connectionController.requestConnection);
router.post('/respond', auth, connectionController.respond);
router.get('/', auth, connectionController.getConnections);
router.get('/recommendations', auth, connectionController.getRecommendations);

module.exports = router;
