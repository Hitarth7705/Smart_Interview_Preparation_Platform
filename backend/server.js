const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const path = require("path");
const fs = require("fs");

// Load .env from backend directory if present
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const codingRoutes = require("./routes/codingRoutes");
// Import all route files
const authRoutes = require("./routes/authRoutes");
const questionRoutes = require("./routes/questionRoutes");
const dsaRoutes = require("./routes/dsaRoutes");
const profileRoutes = require("./routes/profileRoutes");
const mcqRoutes = require("./routes/mcqRoutes");
const srsRoutes = require("./routes/srs");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// API healthcheck
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Use all routes
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/dsa", dsaRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/mcq", mcqRoutes);
app.use("/api/srs", srsRoutes);
app.use("/api/coding", codingRoutes);

// Serve static frontend in production if built
const frontendBuildPath = path.join(__dirname, "../frontend/build");
if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Smart Interview Preparation Platform API Running...");
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
