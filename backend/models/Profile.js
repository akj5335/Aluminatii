import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  collegeId: String,
  branch: String,
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
  contact: String,
  graduationYear: { type: Number },
  degree: String,
  company: { type: String },
  designation: { type: String },
  location: { type: String },
  socialLinks: { linkedin: String, github: String, twitter: String, website: String },
  achievements: [String],
  bio: { type: String },
  skills: { type: [String], default: [] },
  experience: { type: String }, // e.g., "2-5 years"
  photoURL: { type: String },
  isPublic: { type: Boolean, default: true },
  verified: { type: Boolean, default: false },
  reputationScore: { type: Number, default: 0 },
  mentorshipHistory: [{ type: String }],
  credibilityActivities: [{ type: String }],
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Profile', profileSchema);
