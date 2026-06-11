const express = require("express");
const InterviewQuestion = require("../models/InterviewQuestion");

const router = express.Router();

// GET /api/questions — get all questions (with optional filters)
// Query params: category, difficulty, tags
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.difficulty) filter.difficulty = req.query.difficulty;
    if (req.query.tags) filter.tags = { $in: req.query.tags.split(",") };

    const questions = await InterviewQuestion.find(filter).sort({ questionNumber: 1 });
    res.json({ total: questions.length, questions });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/questions/random — get a random question (optional category filter)
router.get("/random", async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.difficulty) filter.difficulty = req.query.difficulty;

    const count = await InterviewQuestion.countDocuments(filter);
    if (count === 0) return res.status(404).json({ message: "No questions found" });

    const random = Math.floor(Math.random() * count);
    const question = await InterviewQuestion.findOne(filter).skip(random);
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/questions/:id — get a single question by questionNumber
router.get("/:id", async (req, res) => {
  try {
    const question = await InterviewQuestion.findOne({ questionNumber: req.params.id });
    if (!question) return res.status(404).json({ message: "Question not found" });
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
