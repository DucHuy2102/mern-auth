import express from 'express';
import { logOut, signIn, signUp, verifyEmail } from '../controllers/auth.controller.js';

const router = express.Router();

// sign-up route
router.post('/sign-up', signUp);

// sign-in route
router.post('/sign-in', signIn);

// log-out route
router.post('/log-out', logOut);

// veryfy-email route
router.post('/verify-email', verifyEmail);

export default router;
