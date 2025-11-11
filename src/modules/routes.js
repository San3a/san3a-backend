import authRoutes from '#src/modules/authentication/auth.route.js';
const mountRoutes = (app) => {
    app.use('/api/auth', authRoutes);
};

export default mountRoutes;
