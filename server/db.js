const mongoose = require("mongoose");

let cached = global.__mongoose_cache__;

if (!cached) {
  cached = global.__mongoose_cache__ = { conn: null, promise: null };
}

const connectDb = async () => {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI nao definido no .env");
    }
    cached.promise = mongoose.connect(uri, {
      autoIndex: true,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = { connectDb };
