import Startup from '../../models/Startup.js';

export const createPitch = async (req, res) => {
    try {
        const { name, tagline, description, stage, fundingGoal, lookingFor, website, logo } = req.body;

        const startup = await Startup.create({
            founder: req.user.id,
            name,
            tagline,
            description,
            stage,
            fundingGoal,
            lookingFor,
            website,
            logo
        });

        res.status(201).json(startup);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getStartups = async (req, res) => {
    try {
        const startups = await Startup.find()
            .populate('founder', 'name photoURL designation company')
            .populate('jobs')
            .sort({ createdAt: -1 });
        res.json(startups);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Add Funding Round
export const addFunding = async (req, res) => {
    try {
        const { id } = req.params;
        const { round, amount, investors, date } = req.body;

        const startup = await Startup.findById(id);
        if (!startup) return res.status(404).json({ message: 'Startup not found' });

        // Ensure user is the founder
        if (startup.founder.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        startup.funding.push({ round, amount, investors, date });
        await startup.save();

        res.json(startup);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
