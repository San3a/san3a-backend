import http from 'http';
import { PORT, SERVER_URL } from '#src/config/config.js';
import dbConnection from '#src/config/db.js';
import { initSocketServer } from '#src/core/socketServer.js';
import app from './app.js';

process.on('uncaughtException', (err) => {
    console.error(`💥 Uncaught Exception >> ${err.name}: ${err.message}`);
    process.exit(1);
});

(async () => {
    try {
        await dbConnection();

        // ✅ Create HTTP server that wraps your Express app
        const server = http.createServer(app);

        // ✅ Initialize Socket.IO server
        const io = initSocketServer(server);

        app.use((req, res, next) => {
            req.io = io;
            next();
        });

        // ✅ Start listening
        server.listen(PORT, () => {
            console.log(`🚀 Server running on ${SERVER_URL}:${PORT}`);
        });

        // ✅ Handle unhandled rejections
        process.on('unhandledRejection', (err) => {
            console.error(`💥 Unhandled Rejection >> ${err.name}: ${err.message}`);
            server.close(() => process.exit(1));
        });
    } catch (err) {
        console.error(`💥 Startup Error >> ${err.message}`);
        process.exit(1);
    }
})();
