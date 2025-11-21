import postRoutes from './post/post.routes.js';

import pastWorkRouter from '#src/modules/past-work/past-work.routes.js';
import techSerivceRouter from '#src/modules/tech-service/tech-service.routes.js';
import categoryRouter from '#src/modules/category/category.routes.js';
import reviewsRouter from '#src/modules/review/review.routes.js';
import authRoutes from '#src/modules/authentication/auth.route.js';
import userRoutes from '#src/modules/user/user.route.js';
import chatRoutes from '#src/modules/chat/chat-route.js';
import chatbotRoutes from '#src/modules/chatbot/chatbot.routes.js';
import adminRoutes from '#src/modules/admin/admin.route.js';

import appointmentRoutes from '#src/modules/appointment/appointment.routes.js';
import paymentRoutes from '#src/modules/payment/payment.routes.js';

import ServiceOrderRoutes from '#src/modules/ServiceOrder/service-order.routes.js';

const mountRoutes = (app) => {
    app.use('/api/past-work', pastWorkRouter);
    app.use('/api/tech-services', techSerivceRouter);
    app.use('/api/categories', categoryRouter);
    app.use('/api/reviews', reviewsRouter);
    app.use('/api/posts', postRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/chat', chatRoutes);
    app.use('/api/chatbot', chatbotRoutes);
    app.use('/api/admin', adminRoutes);

    app.use('/api/appointments', appointmentRoutes);
    app.use('/api/payments', paymentRoutes);
    app.use('/api/service-order', ServiceOrderRoutes)
};

export default mountRoutes;
