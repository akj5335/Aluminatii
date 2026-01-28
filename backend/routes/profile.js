import express from "express";
import Profile from "../models/Profile.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create profile (after user registration/login)
// Create or Update Profile
router.post("/", async (req, res) => {
  try {
    const { userId, collegeId, batchYear, branch, degree, company, designation, coordinates } = req.body;

    // ensure user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if profile exists for this user
    let profile = await Profile.findOne({ user: userId });

    if (profile) {
      // Update existing profile
      // Check if trying to update collegeId to one that belongs to another user
      if (collegeId !== profile.collegeId) {
        const duplicate = await Profile.findOne({ collegeId });
        if (duplicate) return res.status(400).json({ message: "Profile with this College ID already exists" });
      }

      profile.collegeId = collegeId;
      profile.batchYear = batchYear;
      profile.branch = branch;
      profile.degree = degree;
      profile.company = company;
      profile.designation = designation;
      if (coordinates) profile.coordinates = coordinates;

      await profile.save();
      return res.status(200).json({ message: "Profile updated", profile });
    }

    // Create new profile
    // check duplicate collegeId
    const existing = await Profile.findOne({ collegeId });
    if (existing) return res.status(400).json({ message: "Profile already exists with this College ID" });

    profile = new Profile({
      user: userId,
      collegeId,
      batchYear,
      branch,
      degree,
      company,
      designation,
      coordinates
    });

    await profile.save();
    res.status(201).json({ message: "Profile created", profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get current user profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id }).populate("user", "name email");
    if (!profile) {
      return res.status(200).json({ msg: "There is no profile for this user", user: req.user });
    }

    // BADGE CHECK LOGIC (Simple Implementation)
    let badgeAdded = false;
    const hasBadge = (name) => profile.badges.some(b => b.name === name);

    // 1. Skill Sharer: Added at least 1 skill
    if (profile.skills.length > 0 && !hasBadge("Skill Sharer")) {
      profile.badges.push({ name: "Skill Sharer", icon: "fa-solid fa-shapes" });
      badgeAdded = true;
    }

    // 2. Early Adopter: Just for being here!
    if (!hasBadge("Early Adopter")) {
      profile.badges.push({ name: "Early Adopter", icon: "fa-solid fa-rocket" });
      badgeAdded = true;
    }

    // 3. Profile Pro: Filled out bio and location
    if (profile.bio && profile.location && !hasBadge("Profile Pro")) {
      profile.badges.push({ name: "Profile Pro", icon: "fa-solid fa-id-card" });
      badgeAdded = true;
    }

    if (badgeAdded) await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get all profiles (alumni directory)
router.get("/", async (req, res) => {
  try {
    const { q, branch, graduationYear, degree, company } = req.query;
    let query = {};
    if (q) {
      query.$or = [
        { 'user.name': new RegExp(q, 'i') },
        { company: new RegExp(q, 'i') },
        { location: new RegExp(q, 'i') }
      ];
    }
    if (branch) query.branch = branch;
    if (graduationYear) query.graduationYear = graduationYear;
    if (degree) query.degree = degree;
    if (company) query.company = new RegExp(company, 'i');
    const profiles = await Profile.find(query).populate("user", "name email");
    res.json({ profiles });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



// Add Skill
router.post('/skills', authMiddleware, async (req, res) => {
  try {
    const { skillName } = req.body;
    if (!skillName) return res.status(400).json({ message: "Skill name required" });

    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    // Check if skill already exists (case insensitive)
    if (profile.skills.some(s => s.name.toLowerCase() === skillName.toLowerCase())) {
      return res.status(400).json({ message: "Skill already added" });
    }

    profile.skills.push({ name: skillName, endorsements: [] });
    await profile.save();
    res.json(profile.skills);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Remove Skill
router.delete('/skills/:skillName', authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    profile.skills = profile.skills.filter(s => s.name.toLowerCase() !== req.params.skillName.toLowerCase());
    await profile.save();
    res.json(profile.skills);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Endorse Skill
router.post('/:userId/skills/:skillName/endorse', authMiddleware, async (req, res) => {
  try {
    // Prevent self-endorsement
    if (req.params.userId === req.user.id) {
      return res.status(400).json({ message: "Cannot endorse yourself" });
    }

    const profile = await Profile.findOne({ user: req.params.userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const skill = profile.skills.find(s => s.name.toLowerCase() === req.params.skillName.toLowerCase());
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    // Toggle endorsement
    const idx = skill.endorsements.findIndex(id => id.toString() === req.user.id);
    if (idx === -1) {
      skill.endorsements.push(req.user.id);
    } else {
      skill.endorsements.splice(idx, 1);
    }

    await profile.save();
    res.json(skill);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
