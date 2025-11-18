import mongoose from 'mongoose';

const chatbotConversationSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        required: true,
        index: true,
    },
    role: {
        type: String,
        enum: ['user', 'model', 'assistant'],
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
    },
});

const ChatbotConversation = mongoose.model('ChatbotConversation', chatbotConversationSchema);
export default ChatbotConversation;
