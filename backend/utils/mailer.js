
const nodemailer = require("nodemailer");

const EmailConfig = require("../models/EmailConfig");
console.log(
  "EmailConfig model type:",
  typeof EmailConfig
);

console.log(
  "EmailConfig.findOne type:",
  typeof EmailConfig.findOne
);
const { decrypt } = require("./encryption");

const sendOTPEmail = async (toEmail, otp) => {
  try {
    // Retrieve encrypted Gmail credentials
    const config = await EmailConfig.findOne({
      provider: "Gmail"
    });

    if (!config) {
      throw new Error("Gmail configuration not found in MongoDB");
    }

    // Decrypt Gmail App Password
    const gmailPassword = decrypt(
      config.encryptedPassword,
      config.iv,
      config.authTag
    );

    // Configure Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.gmailUser,
        pass: gmailPassword
      }
    });

    // Send OTP
    const info = await transporter.sendMail({
      from: {
        name: "Smart Interview Prep",
        address: config.gmailUser
      },

      to: toEmail,

      subject: "Your Password Reset OTP",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 400px;
          margin: auto;
          padding: 24px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        ">

          <h2 style="color: #6366f1;">
            Password Reset OTP
          </h2>

          <p style="color: #475569;">
            Use the OTP below to reset your password.
            It expires in <strong>10 minutes</strong>.
          </p>

          <div style="
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 12px;
            color: #1e293b;
            text-align: center;
            margin: 24px 0;
          ">
            ${otp}
          </div>

          <p style="color: #94a3b8; font-size: 13px;">
            If you didn't request this, ignore this email.
          </p>

        </div>
      `
    });

    console.log("Gmail OTP sent successfully:", info.messageId);

    return info;

  } catch (error) {
    console.error("GMAIL OTP ERROR:", error.message);
    throw error;
  }
};

module.exports = { sendOTPEmail };
