import { PORT } from '#src/config/config.js';
import dbConnection from '#src/config/db.js';
import app from './app.js';
import 'dotenv/config';

process.on('uncaughtException', (err) => {
    console.error(`💥 Uncaught Exception >> ${err.name}: ${err.message}`);
    process.exit(1);
});

(async () => {
    try {
        await dbConnection();

        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });

        process.on('unhandledRejection', (err) => {
            console.error(`💥 Unhandled Rejection >> ${err.name}: ${err.message}`);
            server.close(() => process.exit(1));
        });
    } catch (err) {
        process.exit(1);
    }
})();
