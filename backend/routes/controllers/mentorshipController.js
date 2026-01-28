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

import MentorshipSession from '../../models/MentorshipSession.js';

export const requestSession = async (req, res) => {
    try {
        const { mentorId, date, duration, topic, note } = req.body;
        const session = await MentorshipSession.create({
            mentor: mentorId,
            mentee: req.user.id,
            date,
            duration,
            topic,
            note
        });
        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSessions = async (req, res) => {
    try {
        const sessions = await MentorshipSession.find({
            $or: [{ mentor: req.user.id }, { mentee: req.user.id }]
        })
            .populate('mentor', 'name photoURL')
            .populate('mentee', 'name photoURL')
            .sort({ date: 1 });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSessionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, meetingLink } = req.body;

        const session = await MentorshipSession.findById(id);
        if (!session) return res.status(404).json({ message: "Session not found" });

        // Authorization check: Only mentor can Accept/Reject. Both can Complete?
        // For simplicity, allowed if user is mentor or mentee involved.
        if (session.mentor.toString() !== req.user.id && session.mentee.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        if (status) session.status = status;
        if (meetingLink) session.meetingLink = meetingLink;

        await session.save();
        res.json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
