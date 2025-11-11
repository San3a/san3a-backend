import ChatbotConversation from '#src/modules/chatbot/chatbotConversation.model.js';
import { getSolution } from '#src/shared/services/ai-service.js';
import { asyncHandler } from '#src/shared/utils/async-handler.js';

const categories = ['سباكة', 'كهرباء', 'نجارة', 'دهانات'];
const systemPrompt =
    'أنت مساعد فني ودود وخبير. قم بتحليل محادثة المستخدم لتحديد الخطوة التالية المناسبة. يجب أن يكون الرد دائمًا باللغة العربية. إذا استطعت، حدد فئة مناسبة من الفئات التالية: سباكة، كهرباء، نجارة، دهانات. إذا لم تنطبق أي فئة، لا تحدد أي فئة.';
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
    let systemInstruction = systemPrompt;

    if (categories.length > 0) {
        systemInstruction += ` إذا كان بالإمكان، اختر واحدة من الفئات التالية للمهمة: ${categories.join(
            '، '
        )}. إذا لم تنطبق أي فئة، لا تقم بتحديد أي فئة.`;
    }
    const messages = [
        { role: 'system', content: systemInstruction },
        ...history.map((msg) => ({ role: msg.role, content: msg.text })),
    ];

    const modelText = await getSolution({ messages, stream: false });

    await saveMessage(conversationId, 'assistant', modelText || '[No response from AI]');

    return modelText;
};
