
const mongoose = require("mongoose");

const codingSubmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CodingQuestion",
      required: true,
    },
    language: {
      type: String,
      enum: ["c", "cpp", "java", "python"],
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    verdict: {
      type: String,
      required: true,
    },
    passedTests: {
      type: Number,
      default: 0,
    },
    totalTests: {
      type: Number,
      default: 0,
    },
    executionTime: {
      type: Number,
      default: 0,
    },
    memory: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "CodingSubmission",
  codingSubmissionSchema
);
