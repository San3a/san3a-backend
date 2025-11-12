import {
    signup,
    login,
    forgotPassword,
    resetPassword,
    updatePassword,
} from '#src/modules/authentication/auth.controller.js';
import { Router } from 'express';

const router = Router();

//endpoints auth
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', updatePassword); // add isAuthorized

export default router;
