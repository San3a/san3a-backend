import { Server } from 'socket.io';

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
            console.log(`🔌 New client connected: ${socket.id}`);
            socket.on('disconnect', () => {
                disconnectHandler(socket);
            });
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
