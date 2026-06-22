const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const InterviewQuestion = require("../models/InterviewQuestion");
const DSAQuestion = require("../models/DSAQuestion");

const router = express.Router();

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized" });
  try {
    req.userId = jwt.verify(auth.slice(7), process.env.JWT_SECRET).id;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

// GET /api/profile — full profile + stats
router.get("/", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const totalQuestions = await InterviewQuestion.countDocuments();
    const totalDSA = await DSAQuestion.countDocuments();

    // Per-category seen counts for interview questions
    const allQuestions = await InterviewQuestion.find({}, "questionNumber category difficulty");
    const seenSet = new Set(user.seenQuestions);
    const categoryStats = {};
    for (const q of allQuestions) {
      if (!categoryStats[q.category])
        categoryStats[q.category] = { total: 0, seen: 0 };
      categoryStats[q.category].total++;
      if (seenSet.has(q.questionNumber)) categoryStats[q.category].seen++;
    }

    // Per-topic DSA stats
    const allDSA = await DSAQuestion.find({}, "dsaNumber topic difficulty");
    const seenDSASet = new Set(user.seenDSA);
    const solvedDSASet = new Set(user.solvedDSA);
    const topicStats = {};
    for (const p of allDSA) {
      if (!topicStats[p.topic])
        topicStats[p.topic] = { total: 0, seen: 0, solved: 0 };
      topicStats[p.topic].total++;
      if (seenDSASet.has(p.dsaNumber)) topicStats[p.topic].seen++;
      if (solvedDSASet.has(p.dsaNumber)) topicStats[p.topic].solved++;
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      questions: {
        total: totalQuestions,
        seen: user.seenQuestions.length,
        categoryStats,
      },
      dsa: {
        total: totalDSA,
        seen: user.seenDSA.length,
        solved: user.solvedDSA.length,
        topicStats,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
