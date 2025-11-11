import mongoose from 'mongoose';
import { MONGO_URL } from './config.js';

const dbConnection = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error while connecting to the database:', error);
        throw error;
    }
};

export default dbConnection;
