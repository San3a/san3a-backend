import express from 'express';
import Conversation from './models/conversation-model.js';
import Message from './models/message-model.js';

const router = express.Router();

// Get conversations for a user
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    const conversations = await Conversation.find({ participants: userId })
        .populate('participants', 'username')
        .populate({
            path: 'messages',
            populate: { path: 'author', select: 'username' },
        });
    res.json(conversations);
});

// Create or get 1-on-1 conversation
router.post('/', async (req, res) => {
    const { participants } = req.body;
    let conversation = await Conversation.findOne({
        participants: { $all: participants, $size: participants.length },
    });
    if (!conversation) {
        conversation = await Conversation.create({ participants });
    }
    res.json(conversation);
});

router.get('/messages/:conversationId', async (req, res) => {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversation: conversationId })
        .populate('author', 'name email image')
        .sort({ date: 1 }); // sort by date ascending
    res.json(messages);
});

// Send a new message
router.post('/messages', async (req, res) => {
    try {
        const { conversationId, author, content, type } = req.body;

        if (!conversationId || !author || !content) {
            return res
                .status(400)
                .json({ message: 'conversationId, author, and content are required' });
        }

        const message = await Message.create({
            conversation: conversationId,
            author,
            content,
            type: type || 'text',
        });

        await Conversation.findByIdAndUpdate(conversationId, {
            $push: { messages: message._id },
        });

        const populatedMessage = await message.populate('author', 'username');
        res.status(201).json(populatedMessage);
    } catch (err) {
        console.error('Error sending message:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:messageId', async (req, res) => {
    const { messageId } = req.params;
    try {
        const message = await Message.findById(messageId);
        if (!message) return res.status(404).json({ message: 'Message not found' });

        await message.deleteOne();

        req.io.to(message.conversation.toString()).emit('messageDeleted', { messageId });

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete message' });
    }
});

export default router;
