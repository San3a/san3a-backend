import chatbotRoutes from './chatbot/chatbot.routes.js';

const mountRoutes = (app) => {
    app.use('/api/chatbot', chatbotRoutes);
};

export default mountRoutes;
