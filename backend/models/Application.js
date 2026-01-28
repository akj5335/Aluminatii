import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resume: { type: String }, // Link to resume
    coverLetter: { type: String },
    status: {
        type: String,
        enum: ['Applied', 'Interviewing', 'Rejected', 'Accepted'],
        default: 'Applied'
    },
    createdAt: { type: Date, default: Date.now }
});

// Prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
