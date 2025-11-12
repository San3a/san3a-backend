import pastWorkRouter from '#src/modules/past-work/past-work-routes.js';
import techSerivceRouter from '#src/modules/tech-service/tech-service.routes.js';
import categoryRouter from '#src/modules/category/category.routes.js';

const mountRoutes = (app) => {
    app.use('/api/past-work', pastWorkRouter);
    app.use('/api/tech-service', techSerivceRouter);
    app.use('/api/categories', categoryRouter);
};

export default mountRoutes;
