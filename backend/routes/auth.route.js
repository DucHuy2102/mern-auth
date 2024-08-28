import express from 'express';
import { logOut, signIn, signUp } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/sign-up', signUp);

router.post('/sign-in', signIn);

router.post('/log-out', logOut);

export default router;
