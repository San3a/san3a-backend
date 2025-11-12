import pastWorkRouter from '#src/modules/past-work/past-work-routes.js';
import techSerivceRouter from '#src/modules/tech-service/tech-service.routes.js';

const mountRoutes = (app) => {
    app.use('/api/past-work', pastWorkRouter);
    app.use('/api/tech-service', techSerivceRouter);
};

export default mountRoutes;
