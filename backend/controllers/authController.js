import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Register Logic
export const register = async (req, res) => {
    try {
        const { name, email, password, collegeId, batchYear, branch, degree, gender } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Hashing Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            collegeId,
            batchYear,
            branch,
            role: role || 'student',
            college: "Generic College" // Default value or from req.body
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || "fallback_secret", {
            expiresIn: "1h",
        });

        res.status(201).json({ token, user: { id: newUser._id, name: newUser.name, email: newUser.email } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login Logic
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "fallback_secret", {
            expiresIn: "1h",
        });

        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Me Logic
export const me = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Forgot Password Stub
export const forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Logic to generate token and send email would go here
        res.status(200).json({ message: 'Email sent' });
    } catch (error) {
        next(error);
    }
};

// Reset Password Stub
export const resetPassword = async (req, res, next) => {
    try {
        // Logic to verify token and reset password would go here
        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        next(error);
    }
};
