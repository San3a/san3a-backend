import pastWorkRouter from '#src/modules/past-work/past-work-routes.js';

import authRoutes from '#src/modules/authentication/auth.route.js';
import userRoutes from '#src/modules/user/user.route.js';
import chatRoutes from '#src/modules/chat/chat-route.js';
const mountRoutes = (app) => {
    app.use('/api/past-work', pastWorkRouter);

    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);

    app.use('/api/chat', chatRoutes);
};

export default mountRoutes;
