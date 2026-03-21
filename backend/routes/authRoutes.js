const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  res.json({ message: "Register route working" });
});

// LOGIN
router.post("/login", async (req, res) => {
  res.json({ message: "Login route working" });
});

module.exports = router;