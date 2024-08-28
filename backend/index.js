import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './database/connectDb.js';
import authRoutes from './routes/auth.route.js';

const app = express();
dotenv.config();
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDb();
});

app.use('/api/auth', authRoutes);
