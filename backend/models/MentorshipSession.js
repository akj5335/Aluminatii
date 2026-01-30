import mongoose from 'mongoose';

const mentorshipSessionSchema = new mongoose.Schema({
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true }, // in minutes
    topic: { type: String, required: true },
    note: String,
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'Completed'],
        default: 'Pending'
    },
    rating: { type: Number, min: 1, max: 5 },
    feedback: String,
    meetingLink: String,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('MentorshipSession', mentorshipSessionSchema);
