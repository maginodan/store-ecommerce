import mongoose from 'mongoose';

const globalWithMongoose = global as typeof globalThis & {
  mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
};

let cached = globalWithMongoose.mongoose;

if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async (
  MONGODB_URI = process.env.MONGODB_URI
) => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is missing');
  }

  try {
    cached.promise =
      cached.promise ||
      mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000, // ✅ still valid and recommended
      });

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    throw err;
  }
};
