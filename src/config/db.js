import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const DB_URI =
      process.env.NODE_ENV === "production"
        ? process.env.MONGODB_URI_ATLAS
        : process.env.MONGODB_URI;

    if (!DB_URI) {
      throw new Error("MongoDB URI not found in environment variables");
    }

    const connection = await mongoose.connect(DB_URI);

    console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // app crash if DB not connected
  }
};

export default connectDB;