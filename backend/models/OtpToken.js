const mongoose = require("mongoose");

const otpTokenSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  // The OTP itself is never stored, only an HMAC of it.
  otpHash: { type: String, required: true },
  // Wrong/used guesses so far; the route blocks the OTP after too many.
  attempts: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // auto-delete after 10 minutes
});

module.exports = mongoose.model("OtpToken", otpTokenSchema);
