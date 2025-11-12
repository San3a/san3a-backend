import ChatbotConversation from '#src/modules/chatbot/chatbotConversation.model.js';
import { getSolution } from '#src/shared/services/ai-service.js';
import { asyncHandler } from '#src/shared/utils/async-handler.js';
import { systemPrompt } from '#src/shared/enums/constants.js';

const saveMessage = asyncHandler(async (conversationId, role, text) => {
    if (!text || text.trim() === '') return null;
    return ChatbotConversation.create({ conversationId, role, text });
});

export const respondWithAiService = async (conversationId, userMessage) => {
    await saveMessage(conversationId, 'user', userMessage);
    const history = await ChatbotConversation.find({ conversationId })
        .sort({ timestamp: 1 })
        .limit(5)
        .lean();

    console.log(history);
    const messages = [
        { role: 'system', content: systemPrompt },
        ...history.map((msg) => ({ role: msg.role, content: msg.text })),
    ];

    const modelText = await getSolution({ messages, stream: false });

    const { response, category } = JSON.parse(modelText);

    await saveMessage(conversationId, 'assistant', response || '[No response from AI]');

    return { response, category };
};
