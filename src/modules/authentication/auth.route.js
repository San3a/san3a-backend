import {
    signup,
    login,
    forgotPassword,
    resetPassword,
    updatePassword,
    socialLoginCallback,
} from '#src/modules/authentication/auth.controller.js';
import { Router } from 'express';
import passport from '#src/shared/utils/passport.js';

const router = Router();

//endpoints auth
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', updatePassword); // add isAuthorized

// ---- GOOGLE OAUTH ----
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
    '/google/callback',
    passport.authenticate('google', { session: false }),
    socialLoginCallback
);

// ---- GITHUB OAUTH ----
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
    '/github/callback',
    passport.authenticate('github', { session: false }),
    socialLoginCallback
);

export default router;
