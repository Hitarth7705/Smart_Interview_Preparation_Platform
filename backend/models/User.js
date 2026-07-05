const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Interview Questions progress
    seenQuestions: { type: [Number], default: [] },       // questionNumbers seen

    // DSA progress
    seenDSA: { type: [Number], default: [] },             // dsaNumbers seen
    solvedDSA: { type: [Number], default: [] },           // dsaNumbers marked solved

    // MCQ progress
    mcqAttempted: { type: [Number], default: [] },        // questionIds attempted
    mcqSolved: { type: [Number], default: [] },           // questionIds solved correctly
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
