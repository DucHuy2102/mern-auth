import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDb } from './database/connectDb.js';
import authRoutes from './routes/auth.route.js';
import cors from 'cors';

const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDb();
});

app.use('/api/auth', authRoutes);
