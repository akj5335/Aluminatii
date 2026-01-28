import mongoose from 'mongoose';

const startupSchema = new mongoose.Schema({
    founder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    logo: { type: String }, // URL
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    stage: {
        type: String,
        enum: ['Idea', 'MVP', 'Seed', 'Series A', 'Growth'],
        default: 'Idea'
    },
    fundingGoal: { type: Number },
    lookingFor: [{ type: String }], // e.g. Co-founder, Investor
    website: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Startup', startupSchema);
