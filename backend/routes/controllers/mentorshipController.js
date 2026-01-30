import User from '../../models/User.js';
import Profile from '../../models/Profile.js';
import { createNotification } from './notificationController.js';
import MentorshipSession from '../../models/MentorshipSession.js';

// Get potential mentors (basic implementation: users who set themselves as mentors or just all profiles)
// Ideally, User model should have an 'isMentor' flag, but we'll use Profiles for now to list professionals.
export const getMentors = async (req, res) => {
    try {
        const mentors = await Profile.find({ user: { $ne: req.user.id } })
            .populate('user', 'name email photoURL')
            .limit(20);

        // Calculate ratings manually
        const mentorsWithRatings = await Promise.all(mentors.map(async (m) => {
            if (!m.user) return null;
            const sessions = await MentorshipSession.find({
                mentor: m.user._id,
                rating: { $exists: true }
            });

            let avgRating = 0;
            if (sessions.length > 0) {
                const sum = sessions.reduce((acc, curr) => acc + curr.rating, 0);
                avgRating = (sum / sessions.length).toFixed(1);
            }

            return { ...m.toObject(), rating: avgRating, reviewCount: sessions.length };
        }));

        res.json(mentorsWithRatings.filter(m => m !== null));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const requestMentorship = async (req, res) => {
    // Placeholder for request logic
    // Would create a Mentorship document
    res.status(200).json({ message: "Mentorship request sent!" });
};



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

        // Notify Mentor
        await createNotification(
            mentorId,
            req.user.id,
            'mentorship_request',
            'New Mentorship Request',
            `${req.user.name} requested a session on ${topic}.`,
            '/mentorship.html'
        );

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

        // Notify Mentee if Accepted/Rejected
        if (status === 'Accepted' || status === 'Rejected') {
            await createNotification(
                session.mentee,
                req.user.id,
                'mentorship_request', // Reusing type
                `Mentorship ${status}`,
                `Your session request was ${status.toLowerCase()}.`,
                '/mentorship.html'
            );
        }

        res.json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Submit Feedback
export const submitFeedback = async (req, res) => {
    try {
        const { rating, feedback } = req.body;
        const session = await MentorshipSession.findById(req.params.id);

        if (!session) return res.status(404).json({ message: 'Session not found' });

        // Only mentee can review
        if (session.mentee.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        session.rating = rating;
        session.feedback = feedback;
        session.status = 'Completed'; // Auto-complete
        await session.save();

        res.json(session);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
