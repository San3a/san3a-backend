import { Server } from 'socket.io';
import Conversation from '#src/modules/chat/models/conversation-model.js';
import Message from '#src/modules/chat/models/message-model.js';

let io;

export const initSocketServer = (server) => {
    if (!io) {
        io = new Server(server, {
            cors: {
                origin: 'http://localhost:5173',
                methods: ['GET', 'POST'],
            },
        });

        io.on('connection', (socket) => {
            console.log(`New client connected: ${socket.id}`);

            socket.on('joinRoom', (conversationId) => {
                socket.join(conversationId);
                console.log(`User joined conversation: ${conversationId}`);
            });

            socket.on('sendMessage', async ({ conversationId, authorId, content, type }) => {
                const message = new Message({
                    author: authorId,
                    conversation: conversationId,
                    content,
                    type,
                });
                await message.save();

                const conversation = await Conversation.findById(conversationId);
                conversation.messages.push(message._id);
                await conversation.save();

                io.to(conversationId).emit(
                    'newMessage',
                    await message.populate('author', 'name email image')
                );
            });
            socket.on('unsendMessage', async ({ messageId, conversationId }) => {
                try {
                    const message = await Message.findById(messageId);
                    if (!message) return;

                    await message.deleteOne();

                    io.to(conversationId).emit('messageDeleted', { messageId });
                } catch (err) {
                    console.error('Failed to unsend message:', err);
                }
            });

            socket.on('disconnect', () => console.log('User disconnected:', socket.id));
        });

        console.log('Socket.IO server initialized');
    }
    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.IO not initialized. Call initSocketServer() first.');
    }
    return io;
};
