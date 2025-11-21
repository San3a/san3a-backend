import * as chatService from './chat-service.js';
import { getIO } from '#src/core/socketServer.js';
export const getConversations = async (req, res) => {
    const { userId } = req.params;
    try {
        const conversations = await chatService.getUserConversations(userId);
        res.json(conversations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMessages = async (req, res) => {
    const { conversationId } = req.params;
    try {
        const messages = await chatService.getConversationMessages(conversationId);
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createConversation = async (req, res) => {
    const { participants } = req.body;
    try {
        const conversation = await chatService.getOrCreateConversation(participants);
        res.json(conversation);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const sendMessage = async (req, res) => {
    const { conversationId, author, content, type } = req.body;
    try {
        if (!conversationId || !author || !content)
            return res
                .status(400)
                .json({ message: 'conversationId, author, and content are required' });

        const message = await chatService.createMessage({ conversationId, author, content, type });

        // Emit via socket
        if (req.io) req.io.to(conversationId).emit('newMessage', message);

        res.status(201).json(message);
    } catch (err) {
        console.error('Error sending message:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteMessage = async (req, res) => {
    const { messageId } = req.params;
    try {
        const message = await Message.findById(messageId);
        if (!message) return res.status(404).json({ message: 'Message not found' });

        await message.deleteOne();

        if (req.io)
            req.io.to(message.conversation.toString()).emit('messageDeleted', { messageId });

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete message' });
    }
};

export const uploadImages = async (req, res) => {
    try {
        console.log('🧾 uploadImages called');
        console.log('Files:', req.files);
        console.log('Body:', req.body);
        const { conversationId } = req.params;
        const { author } = req.body;

        if (!req.body.images || req.body.images.length === 0) {
            return res.status(400).json({ message: 'No images processed' });
        }

        const createdMessages = await chatService.createImageMessages(
            conversationId,
            author,
            req.body.images
        );

        req.io = getIO();
        if (req.io) {
            createdMessages.forEach((msg) => {
                req.io.to(conversationId).emit('newMessage', msg);
            });
        }

        res.status(201).json({
            success: true,
            messages: createdMessages,
        });
    } catch (err) {
        console.error('Image upload error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to upload images',
        });
    }
};

export const getUserConversations = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
    }

    try {
        const conversations = await chatService.getUserConversationsWithOtherUser(userId);
        res.json(conversations);
    } catch (err) {
        console.error('Error fetching conversations:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
