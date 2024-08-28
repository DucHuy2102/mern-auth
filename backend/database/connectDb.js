import mongoose from 'mongoose';

export const connectDb = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
        console.log('Connected to MongoDB successfully!');
    } catch (error) {
        console.log('Error connecting to MongoDB: ', error);
        process.exit(1);
    }
};
