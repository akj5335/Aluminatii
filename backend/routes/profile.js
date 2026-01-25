import express from "express";
import Profile from "../models/Profile.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create profile (after user registration/login)
// Create or Update Profile
router.post("/", async (req, res) => {
  try {
    const { userId, collegeId, batchYear, branch, degree, company, designation } = req.body;

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
    const profile = await Profile.findOne({ user: req.user.id }).populate("user", "name email");
    if (!profile) {
      return res.status(200).json({ msg: "There is no profile for this user", user: req.user });
    }
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

export default router;
