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
        const senderId = req.user.id;

        const newMessage = new Message({
            sender: senderId,
            recipient: recipientId,
            content,
            status: 'sent'
        });

        await newMessage.save();
        await newMessage.populate('sender', 'name photoURL');
        await newMessage.populate('recipient', 'name photoURL');

        // Real-time delivery via Socket.io
        if (req.io && req.userSockets) {
            const recipientSocketId = req.userSockets.get(recipientId);
            if (recipientSocketId) {
                req.io.to(recipientSocketId).emit('receive_message', {
                    ...newMessage.toObject(),
                    senderId: req.user.id // ensure compatibility with frontend
                });
            }
        }

        res.status(201).json(newMessage);
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

// Mark messages as read
export const markAsRead = async (req, res) => {
    try {
        const { messageIds } = req.body;
        const userId = req.user.id;

        if (!messageIds || !Array.isArray(messageIds)) {
            return res.status(400).json({ message: 'messageIds array is required' });
        }

        await Message.updateMany(
            { _id: { $in: messageIds }, recipient: userId },
            { read: true }
        );

        res.json({ message: 'Messages marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
