const crypto = require("crypto");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const OtpToken = require("../models/OtpToken");
const { sendOTPEmail } = require("../utils/mailer");

const router = express.Router();

// ── OTP helpers ───────────────────────────────────────────
const MAX_OTP_ATTEMPTS = 5; // guesses allowed per OTP
const RESEND_COOLDOWN_MS = 60 * 1000; // protects the free email quota

const generateOtp = () => crypto.randomInt(100000, 1000000).toString();

const hashOtp = (email, otp) =>
  crypto
    .createHmac("sha256", process.env.JWT_SECRET)
    .update(`${email}:${otp}`)
    .digest("hex");

const safeEqual = (a, b) => {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
};

// Counts the attempt atomically, then checks the OTP.
// Returns { ok: true } or { ok: false, status, message }.
const checkOtp = async (email, otp) => {
  const record = await OtpToken.findOneAndUpdate(
    { email },
    { $inc: { attempts: 1 } },
    { new: true }
  );

  if (!record) {
    return {
      ok: false,
      status: 400,
      message: "OTP has expired or was never requested. Please request a new one.",
    };
  }

  if (record.attempts > MAX_OTP_ATTEMPTS) {
    await OtpToken.deleteMany({ email });
    return {
      ok: false,
      status: 429,
      message: "Too many incorrect attempts. Please request a new OTP.",
    };
  }

  if (!safeEqual(record.otpHash, hashOtp(email, String(otp).trim()))) {
    return { ok: false, status: 400, message: "Invalid OTP" };
  }

  return { ok: true };
};

// ── REGISTER ──────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ── LOGIN ─────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
      console.error("REGISTER ERROR:", err); // add this line
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ── FORGOT PASSWORD - Send OTP ─────────────────────────────
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== "string")
      return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No account found with this email" });

    // Block rapid re-requests so the free email quota can't be burned
    const existing = await OtpToken.findOne({ email });
    if (existing) {
      const waitMs = RESEND_COOLDOWN_MS - (Date.now() - existing.createdAt.getTime());
      if (waitMs > 0) {
        return res.status(429).json({
          message: `Please wait ${Math.ceil(waitMs / 1000)}s before requesting another OTP.`,
        });
      }
    }

    // Generate 6-digit OTP (cryptographically secure) and store only its hash
    const otp = generateOtp();
    await OtpToken.deleteMany({ email });
    await OtpToken.create({ email, otpHash: hashOtp(email, otp) });

    try {
      await sendOTPEmail(email, otp);
    } catch (mailErr) {
      // Sending failed: drop the OTP so the user can retry immediately
      await OtpToken.deleteMany({ email });
      throw mailErr;
    }

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    // Provider details stay in the server log, not in the response
    console.error("Forgot password error:", err.message);
    res.status(500).json({ message: "Failed to send OTP. Please try again." });
  }
});

// ── VERIFY OTP ─────────────────────────────────────────────
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp || typeof email !== "string")
      return res.status(400).json({ message: "Email and OTP are required" });

    const result = await checkOtp(email, otp);
    if (!result.ok) return res.status(result.status).json({ message: result.message });

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ── RESET PASSWORD ─────────────────────────────────────────
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword || typeof email !== "string" || typeof newPassword !== "string")
      return res.status(400).json({ message: "All fields are required" });
    if (newPassword.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const result = await checkOtp(email, otp);
    if (!result.ok) return res.status(result.status).json({ message: result.message });

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashed });

    // Delete OTP after successful use
    await OtpToken.deleteMany({ email });

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
