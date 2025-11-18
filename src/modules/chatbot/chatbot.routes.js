import { respondWithAiController } from '#src/modules/chatbot/chatbot.controller.js';
import express from 'express';

const router = express.Router();

router.post('/', respondWithAiController);

export default router;
