import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '#src/config/config.js';

const verifyTokenSocket = (socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
        console.error('❌ No token provided in handshake.auth');
        return next(new Error('NOT_AUTHORIZED'));
    }

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        socket.user = decodedToken; // attach user info to socket
        return next();
    } catch (error) {
        console.error('❌ Token verification failed:', error.message);
        return next(new Error('NOT_AUTHORIZED'));
    }
};
export default verifyTokenSocket;
