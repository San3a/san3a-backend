import ChatbotConversation from '#src/modules/chatbot/chatbotConversation.model.js';
import { getSolution } from '#src/shared/services/ai-service.js';
import { asyncHandler } from '#src/shared/utils/async-handler.js';
import { systemPrompt } from '#src/shared/enums/constants.js';
import {
    findCategoryByName,
    getTopTechniciansByCategory,
} from '#src/shared/services/chatbot-helper.js';

function detectLanguage(text) {
    const arabic = /[\u0600-\u06FF]/;
    return arabic.test(text) ? 'ARABIC' : 'ENGLISH';
}

const saveMessage = asyncHandler(async (conversationId, role, text) => {
    if (!text || text.trim() === '') return null;
    return ChatbotConversation.create({ conversationId, role, text });
});

export const respondWithAiService = async (conversationId, userMessage) => {
    const history = await ChatbotConversation.find({ conversationId })
        .sort({ timestamp: -1 })
        .limit(10)
        .lean();

    history.reverse();

    const userLang = detectLanguage(userMessage);
    const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'system', content: `The user's message language is: ${userLang}` },
        ...history.map((msg) => ({ role: msg.role, content: msg.text })),
        { role: 'user', content: userMessage },
    ];

    const modelText = await getSolution({ messages, stream: false });

    let { response, category } = JSON.parse(modelText);

    response = response || '[No response from AI]';
    category = category || null;

    let topTechnicians = [];

    if (category) {
        const categoryDoc = await findCategoryByName(category);
        if (categoryDoc) {
            topTechnicians = await getTopTechniciansByCategory(categoryDoc._id);
        }
    }

    const finalResponse = {
        response,
        category,
        technicians: topTechnicians,
    };
    await saveMessage(conversationId, 'user', userMessage);

    await saveMessage(conversationId, 'assistant', response);

    return finalResponse;
};
