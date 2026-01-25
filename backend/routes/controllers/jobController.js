import Job from '../../models/Job.js';
import Profile from '../../models/Profile.js';

export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 }).populate('postedBy', 'name photoURL');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get recommended jobs for current user (Smart Matching)
export const getRecommendedJobs = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get user profile with skills
        const profile = await Profile.findOne({ user: userId });

        if (!profile || !profile.skills || profile.skills.length === 0) {
            // If no skills, return recent jobs
            const jobs = await Job.find().sort({ createdAt: -1 }).limit(5);
            return res.json(jobs);
        }

        const userSkills = profile.skills.map(s => s.toLowerCase());
        const userLocation = profile.location?.toLowerCase();

        // Get all jobs
        const allJobs = await Job.find().populate('postedBy', 'name photoURL');

        // Calculate match score for each job
        const scoredJobs = allJobs.map(job => {
            let score = 0;
            const reasons = [];

            // Skill matching (most important - 50 points max)
            const jobSkills = (job.skills || []).map(s => s.toLowerCase());
            const matchingSkills = userSkills.filter(skill =>
                jobSkills.some(jobSkill => jobSkill.includes(skill) || skill.includes(jobSkill))
            );

            if (matchingSkills.length > 0) {
                score += matchingSkills.length * 10;
                reasons.push(`${matchingSkills.length} matching skill${matchingSkills.length > 1 ? 's' : ''}`);
            }

            // Location matching (20 points)
            if (userLocation && job.location && job.location.toLowerCase().includes(userLocation)) {
                score += 20;
                reasons.push('Location match');
            }

            // Recent posting bonus (10 points)
            const daysSincePost = (Date.now() - new Date(job.createdAt)) / (1000 * 60 * 60 * 24);
            if (daysSincePost < 7) {
                score += 10;
                reasons.push('Recently posted');
            }

            return {
                ...job.toObject(),
                matchScore: score,
                matchReasons: reasons
            };
        });

        // Sort by score and return top matches
        const recommended = scoredJobs
            .filter(job => job.matchScore > 0)
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 10);

        res.json(recommended);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createJob = async (req, res) => {
    try {
        const job = new Job({
            ...req.body,
            postedBy: req.user.id
        });
        const savedJob = await job.save();
        res.status(201).json(savedJob);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        // Check ownership
        if (job.postedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await job.deleteOne();
        res.json({ message: "Job deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
