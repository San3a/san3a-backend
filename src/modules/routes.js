import pastWorkRouter from '#src/modules/past-work/past-work-routes.js';

const mountRoutes = (app) => {
    app.use('/api/past-work', pastWorkRouter);
};

export default mountRoutes;
