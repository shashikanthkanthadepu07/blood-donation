const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, isConnected: false };
}

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>') || uri.includes('demo:demo123')) {
    // If user hasn't configured a real MongoDB URI yet, use mock memory mode gracefully
    console.log('ℹ️ [MongoDB] No production MONGODB_URI configured. Running in Mock/In-Memory Mode.');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(uri, opts)
      .then((mongooseInstance) => {
        console.log('✅ [MongoDB] Successfully connected to MongoDB Atlas database!');
        cached.isConnected = true;
        return mongooseInstance;
      })
      .catch((err) => {
        console.warn('⚠️ [MongoDB] Connection error, falling back to In-Memory Mock Mode:', err.message);
        cached.promise = null;
        cached.isConnected = false;
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    return null;
  }

  return cached.conn;
}

function isDbConnected() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

module.exports = {
  connectDB,
  isDbConnected
};
