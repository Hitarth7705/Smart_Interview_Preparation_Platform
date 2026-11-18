
const mongoose = require("mongoose");
const emailDB = require("../config/emailDb");

const emailConfigSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      default: "Gmail",
      unique: true
    },

    gmailUser: {
      type: String,
      required: true
    },

    encryptedPassword: {
      type: String,
      required: true
    },

    iv: {
      type: String,
      required: true
    },

    authTag: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Create model on the separate email database
const EmailConfig = emailDB.model(
  "EmailConfig",
  emailConfigSchema
);

module.exports = EmailConfig;
