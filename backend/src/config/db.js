import dotenv from "dotenv";
dotenv.config(); // ✅ VERY IMPORTANT

import mongoose from "mongoose";

const connectDB = async () => {
  console.log("DB MONGO_URI =", process.env.MONGO_URI);

  if (!process.env.MONGO_URI) {
    throw new Error("❌ MONGO_URI not found in db.js");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");
};

export default connectDB;
