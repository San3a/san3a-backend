import pastWorkRouter from '#src/modules/past-work/past-work.routes.js';
import techSerivceRouter from '#src/modules/tech-service/tech-service.routes.js';
import reviewsRouter from '#src/modules/review/review.routes.js';

import authRoutes from '#src/modules/authentication/auth.route.js';
import userRoutes from '#src/modules/user/user.route.js';
import chatRoutes from '#src/modules/chat/chat-route.js';
import adminRoutes from '#src/modules/admin/admin.route.js';
const mountRoutes = (app) => {
    app.use('/api/past-work', pastWorkRouter);
    app.use('/api/tech-service', techSerivceRouter);
    app.use('/api/reviews', reviewsRouter);
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/chat', chatRoutes);
    app.use('/api/admin', adminRoutes);
};

export default mountRoutes;
