const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://localhost:27017/InterviewDB");
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB Connection Error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;