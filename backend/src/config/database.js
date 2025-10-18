import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'plannerdb',
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1); // encerra o app se não conectar
  }
}
