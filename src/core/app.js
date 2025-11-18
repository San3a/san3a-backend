import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import hpp from 'hpp';
import { xss } from 'express-xss-sanitizer';
import morgan from 'morgan';
import limiter from '#src/shared/middlewares/rate-limiter.middleware.js';
import { unhandledRoutesHandler } from '#src/shared/middlewares/unhandled-routes.middleware.js';
import mountRoutes from '#src/modules/routes.js';
import globalErrorHandler from '#src/shared/middlewares/global-error-handler.middleware.js';
import { CLIENT_URL } from '#src/config/config.js';

const app = express();

app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true, // if you use cookies or auth headers
    })
);

// Optional: handle preflight requests for all routes
app.options(
    '*all',
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
    })
);

app.set('query parser', 'extended');

app.use(helmet());

app.use(compression());

app.use(limiter);

app.use(express.json({ limit: '30kb' }));
app.use(express.urlencoded({ extended: true, limit: '30kb' }));

app.use(hpp());

app.use(xss());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

mountRoutes(app);

app.use(unhandledRoutesHandler);

app.use(globalErrorHandler);

export default app;
