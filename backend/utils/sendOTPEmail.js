const nodemailer = require("nodemailer");
const EmailConfig = require("../models/EmailConfig");
const { decrypt } = require("./encryption");

const sendOTPEmail = async (toEmail, otp) => {
    let gmailUser = process.env.MAIL_USER;
    let gmailPassword = process.env.MAIL_PASS;

    try {
        const config = await EmailConfig.findOne({ provider: "Gmail" });
        if (config && config.encryptedPassword && process.env.EMAIL_ENCRYPTION_KEY) {
            gmailUser = config.gmailUser;
            gmailPassword = decrypt(config.encryptedPassword, config.iv, config.authTag);
        }
    } catch (err) {
        console.warn("EmailConfig DB lookup fallback to env:", err.message);
    }

    if (!gmailUser || !gmailPassword) {
        throw new Error("Gmail configuration not found. Please set MAIL_USER and MAIL_PASS in environment variables.");
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: gmailUser,
            pass: gmailPassword.replace(/\s/g, "")
        }
    });

    await transporter.sendMail({
        from: {
            name: "Smart Interview Prep",
            address: gmailUser
        },
        to: toEmail,
        subject: "Your Password Reset OTP",
        html: `
            <h2>Password Reset OTP</h2>
            <h1>${otp}</h1>
            <p>This OTP expires in 10 minutes.</p>
        `
    });
};

module.exports = { sendOTPEmail };
