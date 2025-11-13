import express from 'express';
import * as chatController from './chat-controller.js';
import { upload } from '#src/shared/utils/upload.js';
import { handleImageCreate } from '#src/shared/middlewares/handleImageCreate.js';

const router = express.Router();

// Conversations
router.get('/:userId', chatController.getConversations);
router.post('/', chatController.createConversation);

// Messages
router.get('/messages/:conversationId', chatController.getMessages);
router.post('/messages', chatController.sendMessage);

// Upload images to conversation
router.post(
    '/:conversationId/upload',
    upload.array('images', 10),
    handleImageCreate,
    async (req, res) => {
        try {
            const { conversationId } = req.params;
            const { userId } = req.body;

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: 'No files uploaded' });
            }

            const createdMessages = [];

            for (const file of req.files) {
                const imageUrl = file.url;

                const message = await chatController.sendMessage({
                    conversationId,
                    author: userId,
                    content: imageUrl,
                    type: 'image',
                });

                createdMessages.push(message);
            }

            res.status(201).json({ messages: createdMessages });
        } catch (err) {
            console.error('Image upload error:', err);
            res.status(500).json({ message: 'Failed to upload images' });
        }
    }
);

// Delete a message
router.delete('/:messageId', chatController.deleteMessage);

export default router;
