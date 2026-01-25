const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');

router.get('/users', auth, adminOnly, adminController.getUsers);
router.post('/users/:userId/approve', auth, adminOnly, adminController.approveUser);
router.get('/stats', auth, adminOnly, adminController.stats);

module.exports = router;
