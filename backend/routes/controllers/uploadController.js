import User from '../../models/User.js';

export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Save path -> publicly accessible under /uploads
    const urlPath = `/uploads/${req.file.filename}`;
    user.photoURL = urlPath;
    await user.save();

    res.json({ photoURL: urlPath });
  } catch (err) {
    console.error('Photo upload error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
