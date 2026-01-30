import Connection from '../../models/Connection.js';
import { createNotification } from './notificationController.js';

export const requestConnection = async (req, res) => {
  try {
    const { receiverId } = req.body;
    if (!receiverId) return res.status(400).json({ message: 'receiverId required' });
    if (receiverId === req.user._id.toString()) return res.status(400).json({ message: 'Invalid' });

    const exists = await Connection.findOne({
      $or: [
        { requester: req.user._id, receiver: receiverId },
        { requester: receiverId, receiver: req.user._id }
      ]
    });
    if (exists) return res.status(400).json({ message: 'Connection exists' });

    const connection = await Connection.create({ requester: req.user._id, receiver: receiverId });

    // Notify Receiver
    await createNotification(
      receiverId,
      req.user._id,
      'connection_request',
      'New Connection Request',
      `${req.user.name} wants to connect with you.`,
      '/dashboard.html'
    );

    res.json(connection);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const respond = async (req, res) => {
  try {
    const { connectionId, action } = req.body; // action: 'accept'|'decline'
    const connection = await Connection.findById(connectionId);
    if (!connection) return res.status(404).json({ message: 'Not found' });
    if (connection.receiver.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not allowed' });

    connection.status = action === 'accept' ? 'accepted' : 'declined';
    await connection.save();

    if (action === 'accept') {
      const User = (await import('../../models/User.js')).default;
      const receiverUser = await User.findById(req.user._id);

      await createNotification(
        connection.requester,
        req.user._id,
        'connection_accepted',
        'Connection Accepted',
        `${receiverUser.name} accepted your connection request.`,
        `/profile.html?id=${req.user._id}`
      );
    }

    res.json(connection);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getConnections = async (req, res) => {
  try {
    const connections = await Connection.find({
      $or: [{ requester: req.user._id }, { receiver: req.user._id }],
      status: 'accepted'
    }).populate('requester receiver', 'name email');
    res.json(connections);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const Profile = (await import('../../models/Profile.js')).default;
    const myProfile = await Profile.findOne({ user: req.user._id });

    if (!myProfile) return res.json([]);

    // Fetch potential matches (not me)
    let candidates = await Profile.find({ user: { $ne: req.user._id } }).populate('user', 'name photoURL');

    // Filter out existing connections (TODO for later: check Connection model)
    // For now, just score everyone.

    const scored = candidates.map(p => {
      let score = 0;
      let reasons = [];

      // Ensure user exists (in case of orphan profile)
      if (!p.user) return null;

      // 1. Company Match (+5)
      if (myProfile.company && p.company && myProfile.company.toLowerCase() === p.company.toLowerCase()) {
        score += 5;
        reasons.push(`Works at ${p.company}`);
      }

      // 2. Batch Match (+3)
      if (myProfile.batchYear && p.batchYear && myProfile.batchYear === p.batchYear) {
        score += 3;
        reasons.push(`Class of ${p.batchYear}`);
      }

      // 3. Shared Skills (+2 each)
      if (myProfile.skills && p.skills) {
        const shared = p.skills.filter(s => myProfile.skills.some(ms => ms.name.toLowerCase() === s.name.toLowerCase()));
        if (shared.length > 0) {
          score += (shared.length * 2);
          reasons.push(`${shared.length} shared skills`);
        }
      }

      return { ...p.toObject(), score, matchReason: reasons[0] || 'Alumni Network' };
    });

    // Sort by score desc and take top 5
    const top = scored.filter(s => s && s.score > 0).sort((a, b) => b.score - a.score).slice(0, 4);

    res.json(top);

  } catch (err) {
    console.error("Algo error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};
