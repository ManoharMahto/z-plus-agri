import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.log('--------------------------------------------------');
    console.log('ℹ️ [DB] MONGO_URI is not set in server/.env.');
    console.log('ℹ️ [DB] Running with Built-in Memory Store (Fallback mode).');
    console.log('ℹ️ [DB] To connect Free MongoDB Atlas:');
    console.log('       1. Go to https://www.mongodb.com/cloud/atlas');
    console.log('       2. Create a Free M0 cluster');
    console.log('       3. Copy connection string & paste in server/.env');
    console.log('--------------------------------------------------');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ [MongoDB] Connected: ${conn.connection.host}`);
    return true;
  } catch (err) {
    console.error(`❌ [MongoDB] Connection error: ${err.message}`);
    console.log('ℹ️ [DB] Falling back to Memory Store mode.');
    return false;
  }
};
