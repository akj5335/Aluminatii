import express from 'express';
import Profile from '../models/Profile.js';

const router = express.Router();

// @route   GET /api/leaderboard
// @desc    Get top profiles by reputation score
// @access  Public
router.get('/', async (req, res) => {
    try {
        const topProfiles = await Profile.find({ isPublic: true })
            .sort({ reputationScore: -1 })
            .limit(50)
            .populate('user', 'name photoURL email')
            .lean();

        res.json(topProfiles);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
