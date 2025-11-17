import pastWorkRouter from '#src/modules/past-work/past-work.routes.js';
import techSerivceRouter from '#src/modules/tech-service/tech-service.routes.js';
import categoryRouter from '#src/modules/category/category.routes.js';
import reviewsRouter from '#src/modules/review/review.routes.js';

import authRoutes from '#src/modules/authentication/auth.route.js';
import userRoutes from '#src/modules/user/user.route.js';
const mountRoutes = (app) => {
    app.use('/api/past-work', pastWorkRouter);
    app.use('/api/tech-services', techSerivceRouter);
    app.use('/api/categories', categoryRouter);
    app.use('/api/reviews', reviewsRouter);
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
};

export default mountRoutes;
