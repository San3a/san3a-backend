import postRoutes from './post/post.routes.js';

const mountRoutes = (app) => {
    app.use('/api/posts', postRoutes);
};

export default mountRoutes;
