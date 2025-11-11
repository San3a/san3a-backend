import chatbotRoutes from './chatbot/chatbot.routes.js';

const mountRoutes = (app) => {
    app.use('/api/v1/chatbot', chatbotRoutes);
};

export default mountRoutes;
