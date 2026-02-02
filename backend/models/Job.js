import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: String,
    requirements: [String],
    location: String,
    salary: String,
    type: { type: String, enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance', 'Remote'], default: 'Full-time' },
    remote: { type: Boolean, default: false },
    applicationDeadline: { type: Date },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    link: String,
    minExperience: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

// Compound index for search optimization
jobSchema.index({ title: 'text', company: 'text', description: 'text', location: 'text' });
// Index for sorting/filtering
jobSchema.index({ createdAt: -1 });
jobSchema.index({ type: 1 });
jobSchema.index({ minExperience: 1 });

export default mongoose.model("Job", jobSchema);
