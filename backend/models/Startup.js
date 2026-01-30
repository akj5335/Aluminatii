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
    funding: [{
        round: { type: String, required: true },
        amount: { type: String, required: true },
        date: { type: Date, default: Date.now },
        investors: { type: String }
    }],
    createdAt: { type: Date, default: Date.now }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual Population of Jobs 
startupSchema.virtual('jobs', {
    ref: 'Job',
    localField: 'name',
    foreignField: 'company'
});

export default mongoose.model('Startup', startupSchema);
