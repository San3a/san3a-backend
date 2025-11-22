import { respondWithAiService } from '#src/modules/chatbot/chatbot.service.js';
import { asyncHandler } from '#src/shared/utils/async-handler.js';
import { FAIL, SUCCESS } from '#src/shared/utils/response-status.js';
import { StatusCodes } from 'http-status-codes';

export const respondWithAiController = asyncHandler(async (req, res) => {
    const { conversationId, userMessage } = req.body;

    try {
        const { response, category, technicians } = await respondWithAiService(
            conversationId,
            userMessage
        );

        return res.status(StatusCodes.OK).json({
            status: SUCCESS,
            data: { response, category, technicians },
        });
    } catch (error) {
        console.error('AI Service Error:', error);

        return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
            status: FAIL,
            message: 'AI model is currently unavailable. Please try again later.',
        });
    }
});
