import Message from '../../models/Message.js';
import User from '../../models/User.js';

// Get list of conversations (unique users you've chatted with)
export const getConversations = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get unique users from sent and received messages
        const messages = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { recipient: userId }]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ['$sender', userId] },
                            '$recipient',
                            '$sender'
                        ]
                    },
                    lastMessage: { $first: '$$ROOT' }
                }
            }
        ]);

        // Populate user details
        const conversations = await User.populate(messages, {
            path: '_id',
            select: 'name photoURL'
        });

        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get messages with a specific user
export const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, recipient: userId },
                { sender: userId, recipient: currentUserId }
            ]
        })
            .populate('sender', 'name photoURL')
            .populate('recipient', 'name photoURL')
            .sort({ createdAt: 1 });

        // Mark received messages as read
        await Message.updateMany(
            { sender: userId, recipient: currentUserId, read: false },
            { read: true }
        );

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Send a message
export const sendMessage = async (req, res) => {
    try {
        const { recipientId, content } = req.body;

        const message = new Message({
            sender: req.user.id,
            recipient: recipientId,
            content
        });

        await message.save();
        await message.populate('sender', 'name photoURL');
        await message.populate('recipient', 'name photoURL');

        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get unread message count
export const getUnreadCount = async (req, res) => {
    try {
        const count = await Message.countDocuments({
            recipient: req.user.id,
            read: false
        });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
