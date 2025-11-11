import { signup, login } from '#src/modules/authentication/auth.controller.js';
import { Router } from 'express';

const router = Router();

//endpoints auth
router.post('/signup', signup);
router.post('/login', login);

export default router;
