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
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  socialLinks: { linkedin: String, github: String, twitter: String, website: String },
  badges: [{
    name: String,
    icon: String,
    earnedAt: { type: Date, default: Date.now }
  }],
  achievements: [String],
  bio: { type: String },
  skills: [{
    name: { type: String, required: true },
    endorsements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }],
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
