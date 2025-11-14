import authRoutes from '#src/modules/authentication/auth.route.js';
import userRoutes from '#src/modules/user/user.route.js';
import passport from '#src/shared/utils/passport.js';
const mountRoutes = (app) => {
    app.use(passport.initialize());
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
};

export default mountRoutes;
