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
            .sort({ createdAt: -1 });
        res.json(startups);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
