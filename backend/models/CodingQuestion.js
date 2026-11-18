
const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema(
  {
    input: { type: String, default: "" },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: true },
  },
  { _id: false }
);

const codingQuestionSchema = new mongoose.Schema(
  {
    questionNumber: { type: Number, unique: true, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    topic: { type: String, required: true },
    constraints: [{ type: String }],
    examples: [
      {
        input: String,
        output: String,
        explanation: String,
      },
    ],
    testCases: {
      type: [testCaseSchema],
      validate: (cases) => cases.length > 0,
    },
    timeLimit: { type: Number, default: 2 },
    memoryLimit: { type: Number, default: 128000 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CodingQuestion", codingQuestionSchema);
