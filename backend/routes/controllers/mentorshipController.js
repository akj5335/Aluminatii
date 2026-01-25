import User from '../../models/User.js';
import Profile from '../../models/Profile.js';

// Get potential mentors (basic implementation: users who set themselves as mentors or just all profiles)
// Ideally, User model should have an 'isMentor' flag, but we'll use Profiles for now to list professionals.
export const getMentors = async (req, res) => {
    try {
        // Find profiles that are NOT the current user
        // In a real app, filter by "willing to mentor"
        const profiles = await Profile.find({ user: { $ne: req.user.id } })
            .populate('user', 'name email photoURL')
            .limit(20);
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const requestMentorship = async (req, res) => {
    // Placeholder for request logic
    // Would create a Mentorship document
    res.status(200).json({ message: "Mentorship request sent!" });
};
