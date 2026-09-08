import mongoose from "mongoose";
import User from "../model/userModel.js";
import { users } from "./data.js";
async function connectDB() {
  try {
    const connect = await mongoose.connect(
      "mongodb://localhost:27017/aggregation"
    );
    console.log("connected successfully!");
  } catch (error) {
    console.log(error.message);
  }
}

async function initDB() {
  try {
    connectDB();
    await User.deleteMany({});
    await User.insertMany(users);
    console.log("DB initialized");
  } catch (error) {
    console.log(error.message);
  }
}

// initDB();
export default connectDB