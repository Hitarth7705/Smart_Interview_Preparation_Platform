
const express = require("express");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");
const CodingQuestion = require("../models/CodingQuestion");
const CodingSubmission = require("../models/CodingSubmission");
const { executeCode } = require("../services/judge0Service");

const router = express.Router();

const LANGUAGES = ["c", "cpp", "java", "python"];

function cleanQuestion(question) {
  return {
    _id: question._id,
    questionNumber: question.questionNumber,
    title: question.title,
    description: question.description,
    difficulty: question.difficulty,
    topic: question.topic,
    constraints: question.constraints,
    examples: question.examples,
  };
}

function normalizeOutput(value) {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .trim();
}

// GET /api/coding/random
// Select an unsolved random question, avoiding the previous question.
router.get("/random", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const solvedRows = await CodingSubmission.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          verdict: "Accepted",
        },
      },
      { $group: { _id: "$questionId" } },
    ]);

    const solvedIds = solvedRows.map((row) => row._id);
    const previousId = req.query.exclude;

    let filter = {
      isActive: true,
      _id: { $nin: [...solvedIds, ...(mongoose.isValidObjectId(previousId) ? [new mongoose.Types.ObjectId(previousId)] : [])] },
    };

    let questions = await CodingQuestion.find(filter).select("_id");
    // If all unsolved questions have been used/solved, allow repeats,
    // but still avoid the immediately previous question.
    if (!questions.length) {
      filter = { isActive: true };
      if (mongoose.isValidObjectId(previousId)) {
        filter._id = { $ne: new mongoose.Types.ObjectId(previousId) };
      }
      questions = await CodingQuestion.find(filter).select("_id");
    }

    if (!questions.length) {
      return res.status(404).json({ message: "No coding questions are available yet." });
    }

    const chosen = questions[Math.floor(Math.random() * questions.length)];
    const question = await CodingQuestion.findById(chosen._id);

    res.json({ question: cleanQuestion(question) });
  } catch (error) {
    console.error("Random coding question:", error);
    res.status(500).json({ message: "Could not load a random question." });
  }
});

// POST /api/coding/run
// Runs user-provided custom input. Does not reveal hidden test cases.
router.post("/run", authMiddleware, async (req, res) => {
  try {
    const { code, language, stdin } = req.body;

    if (!code || typeof code !== "string" || code.length > 50000) {
      return res.status(400).json({ message: "Enter code (maximum 50,000 characters)." });
    }
    if (!LANGUAGES.includes(language)) {
      return res.status(400).json({ message: "Unsupported language." });
    }

    const result = await executeCode({ code, language, stdin });

    res.json({
      status: result.status?.description || "Unknown",
      stdout: result.stdout || "",
      stderr: result.stderr || "",
      compileOutput: result.compile_output || "",
      message: result.message || "",
      time: result.time || null,
      memory: result.memory || null,
    });
  } catch (error) {
    console.error("Run code error:", error.response?.data || error.message);
    res.status(502).json({ message: error.message || "Code execution failed." });
  }
});

// POST /api/coding/submit
// Runs all server-side test cases and stores the attempt.
router.post("/submit", authMiddleware, async (req, res) => {
  try {
    const { questionId, code, language } = req.body;

    if (!mongoose.isValidObjectId(questionId)) {
      return res.status(400).json({ message: "Invalid question." });
    }
    if (!code || typeof code !== "string" || code.length > 50000) {
      return res.status(400).json({ message: "Enter valid code (maximum 50,000 characters)." });
    }
    if (!LANGUAGES.includes(language)) {
      return res.status(400).json({ message: "Unsupported language." });
    }

    const question = await CodingQuestion.findOne({
      _id: questionId,
      isActive: true,
    });

    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    let passed = 0;
    let verdict = "Accepted";
    let totalTime = 0;
    let lastMemory = null;

    for (const test of question.testCases) {
      const result = await executeCode({
        code,
        language,
        stdin: test.input,
        timeLimit: question.timeLimit,
      });

      const status = result.status?.description || "Unknown";

      if (status !== "Accepted") {
        verdict =
          status === "Compilation Error" ? "Compilation Error" :
          status === "Time Limit Exceeded" ? "Time Limit Exceeded" :
          status === "Runtime Error (NZEC)" || status.startsWith("Runtime Error")
            ? "Runtime Error"
            : status;
        break;
      }

      if (normalizeOutput(result.stdout) !== normalizeOutput(test.expectedOutput)) {
        verdict = "Wrong Answer";
        break;
      }

      passed++;
      totalTime += Number(result.time || 0);
      lastMemory = result.memory || lastMemory;
    }

    const submission = await CodingSubmission.create({
      userId: req.user.id,
      questionId: question._id,
      language,
      code,
      verdict,
      passedTests: passed,
      totalTests: question.testCases.length,
      executionTime: totalTime.toFixed(3),
      memory: lastMemory,
    });

    res.json({
      verdict,
      passedTests: passed,
      totalTests: question.testCases.length,
      executionTime: totalTime.toFixed(3),
      memory: lastMemory,
      submissionId: submission._id,
    });
  } catch (error) {
    console.error("Submit code error:", error.response?.data || error.message);
    res.status(502).json({ message: error.message || "Submission evaluation failed." });
  }
});

// GET /api/coding/progress
router.get("/progress", authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const [totalQuestions, accepted, attempts] = await Promise.all([
      CodingQuestion.countDocuments({ isActive: true }),
      CodingSubmission.aggregate([
        { $match: { userId, verdict: "Accepted" } },
        { $group: { _id: "$questionId" } },
        { $count: "total" },
      ]),
      CodingSubmission.countDocuments({ userId }),
    ]);

    res.json({
      totalQuestions,
      solvedQuestions: accepted[0]?.total || 0,
      totalAttempts: attempts,
    });
  } catch (error) {
  console.error("Coding progress error:", error);
  res.status(500).json({
    message: "Could not load progress.",
    error: error.message,
  });
}
});

module.exports = router;
