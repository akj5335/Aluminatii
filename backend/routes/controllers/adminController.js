import User from '../../models/User.js';
import Profile from '../../models/Profile.js';
import Event from '../../models/Events.js';
import Post from '../../models/Posts.js';

export const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isApproved = true;
    await user.save();
    res.json({ message: 'Approved', userId });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    const profiles = await Profile.find().populate('user', 'name email');
    res.json({ users, profiles });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const stats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const eventCount = await Event.countDocuments();
    const postCount = await Post.countDocuments();
    res.json({ userCount, eventCount, postCount });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
