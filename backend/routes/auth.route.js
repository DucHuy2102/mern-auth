import express from 'express';
import {
    forgotPassword,
    logOut,
    signIn,
    signUp,
    verifyEmail,
    resetPassword,
    checkAuth,
} from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// check authentification route
router.get('/check-auth', verifyToken, checkAuth);

// sign-up route
router.post('/sign-up', signUp);

// sign-in route
router.post('/sign-in', signIn);

// log-out route
router.post('/log-out', logOut);

// veryfy-email route
router.post('/verify-email', verifyEmail);

// forgot-password route
router.post('/forgot-password', forgotPassword);

// reset-password route
router.post('/reset-password/:token', resetPassword);

export default router;
