import Profile from "../../models/Profile.js";
import User from "../../models/User.js";

// AI Logic: Calculate Jaccard Similarity between two sets of skills
const calculateSimilarity = (skillsA, skillsB) => {
    if (!skillsA || !skillsB) return 0;
    const setA = new Set(skillsA.map(s => s.name.toLowerCase()));
    const setB = new Set(skillsB.map(s => s.name.toLowerCase()));

    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);

    return union.size === 0 ? 0 : intersection.size / union.size;
};

export const getRecommendations = async (req, res) => {
    try {
        const userId = req.user.id;
        const userProfile = await Profile.findOne({ user: userId });

        if (!userProfile) {
            return res.status(404).json({ message: "Create your profile to get recommendations" });
        }

        // Get all other profiles
        // Optimization: In production, use MongoDB Aggregation or Vector Search
        // For Hackathon/Demo: Fetch all and sort in memory (50 users is fine)
        const allProfiles = await Profile.find({ user: { $ne: userId } })
            .populate('user', 'name photoURL email')
            .limit(100);

        const recommendations = allProfiles.map(p => {
            const score = calculateSimilarity(userProfile.skills, p.skills);
            return {
                profile: p,
                score,
                matchReason: `Matches ${Math.round(score * 100)}% of your skills`
            };
        })
            .filter(r => r.score > 0) // Only relevant matches
            .sort((a, b) => b.score - a.score)
            .slice(0, 5); // Top 5

        // If no matches found (e.g., new user), give random "Discover" suggestions
        let finalResults = recommendations;
        if (finalResults.length < 3) {
            const randoms = allProfiles
                .sort(() => 0.5 - Math.random())
                .slice(0, 3 - finalResults.length)
                .map(p => ({
                    profile: p,
                    score: 0,
                    matchReason: "Discover new connections"
                }));
            finalResults = [...finalResults, ...randoms];
        }

        res.json({ recommendations: finalResults });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};
