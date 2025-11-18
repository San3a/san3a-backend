import AppError from '#src/shared/utils/app-error.js';
import { Groq } from 'groq-sdk';

const groq = new Groq();

/**
 * Get AI solution from Groq chat model.
 * @param {Array<Object>} messages - Array of messages [{role, content}]
 * @param {boolean} stream - Whether to stream response
 * @returns {Promise<AsyncIterable|String>} - Async iterable if stream=true, string if stream=false
 */
export async function getSolution({ messages, stream = false }) {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages,
            model: 'openai/gpt-oss-20b',
            temperature: 0.7,
            max_completion_tokens: 1024,
            stream,
            top_p: 1,
            reasoning_effort: 'medium',
        });

        if (stream) {
            return chatCompletion;
        }
        return chatCompletion.choices[0].message.content;
    } catch (error) {
        console.error('Groq API Error:', error);
        throw new AppError('Could not get solution from AI model.');
    }
}
