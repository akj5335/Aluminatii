
export const handleMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const lowerMsg = message.toLowerCase();
        let response = "";

        if (lowerMsg.match(/apply|job|career/)) {
            response = "To apply for a job, go to the Jobs section, click on a job card, and hit the 'Apply' button. Make sure your profile is updated!";
        } else if (lowerMsg.match(/reset|password|forgot/)) {
            response = "You can reset your password by clicking 'Forgot Password' on the login screen. We'll send you a reset link.";
        } else if (lowerMsg.match(/contact|support|admin|help/)) {
            response = "You can contact support at admin@aluminati.com or visit the Help Center.";
        } else if (lowerMsg.match(/event|meetup|session/)) {
            response = "Check out the Events tab for upcoming alumni meetups and webinars.";
        } else if (lowerMsg.match(/verify|badge|blue tick/)) {
            response = "To get verified, complete your profile and request verification from your profile settings. An admin will review it shortly.";
        } else {
            response = "I'm a simple bot and I didn't understand that. Try asking about jobs, password reset, or events.";
        }

        res.json({ response });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
