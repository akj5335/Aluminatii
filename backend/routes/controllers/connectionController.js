import Connection from '../../models/Connection.js';

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
