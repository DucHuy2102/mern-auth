import express from 'express';
import {
    forgotPassword,
    logOut,
    signIn,
    signUp,
    verifyEmail,
    resetPassword,
} from '../controllers/auth.controller.js';

const router = express.Router();

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
