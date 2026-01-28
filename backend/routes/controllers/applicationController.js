import Application from '../../models/Application.js';
import Job from '../../models/Job.js';

// Apply to a job
export const applyToJob = async (req, res) => {
    try {
        const { id } = req.params; // Job ID
        const { resume, coverLetter } = req.body;
        const userId = req.user.id;

        // Check if job exists
        const job = await Job.findById(id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        // Check if already applied
        const existing = await Application.findOne({ job: id, applicant: userId });
        if (existing) return res.status(400).json({ message: "You have already applied to this job" });

        const application = await Application.create({
            job: id,
            applicant: userId,
            resume,
            coverLetter
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get my applications
export const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user.id })
            .populate('job', 'title company location type')
            .sort({ createdAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get applicants for a job (Job Poster only)
export const getJobApplications = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findById(id);

        if (!job) return res.status(404).json({ message: "Job not found" });
        if (job.postedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const applications = await Application.find({ job: id })
            .populate('applicant', 'name email photoURL headline') // Assuming User model has headline, if not it will just return others
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update status
export const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params; // Application ID, NOT Job ID
        const { status } = req.body;

        const application = await Application.findById(id).populate('job');
        if (!application) return res.status(404).json({ message: "Application not found" });

        // Check if user owns the job
        if (application.job.postedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        application.status = status;
        await application.save();

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
