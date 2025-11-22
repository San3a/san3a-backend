import express from 'express';
import * as chatController from './chat-controller.js';
import { upload } from '#src/shared/utils/upload.js';
import { handleImageCreate } from '#src/shared/middlewares/handleImageCreate.js';

const router = express.Router();

router.get('/:userId', chatController.getConversations);
router.post('/', chatController.createConversation);

router.get('/messages/:conversationId', chatController.getMessages);
router.post('/messages', chatController.sendMessage);

import Message from './models/message-model.js';

router.post(
    '/:conversationId/upload',
    (req, res, next) => {
        upload.array('images', 10)(req, res, (err) => {
            if (err) {
                console.error('❌ Multer error:', err);
                return res.status(500).json({ message: 'Upload failed', error: err.message });
            }
            console.log('✅ Multer success:', req.files);
            next();
        });
    },
    handleImageCreate(Message),
    chatController.uploadImages
);
router.delete('/:messageId', chatController.deleteMessage);

router.post('/conversations', chatController.getUserConversations);

export default router;
