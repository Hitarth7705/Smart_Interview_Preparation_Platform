const nodemailer = require("nodemailer");

const EmailConfig = require("../models/EmailConfig");
const { decrypt } = require("./encryption");

const sendOTPEmail = async (toEmail, otp) => {
    const config = await EmailConfig.findOne({
        provider: "Gmail"
    });

    if (!config) {
        throw new Error("Gmail configuration not found");
    }

    const gmailPassword = decrypt(
        config.encryptedPassword,
        config.iv,
        config.authTag
    );

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: config.gmailUser,
            pass: gmailPassword
        }
    });

    await transporter.sendMail({
        from: {
            name: "Smart Interview Prep",
            address: config.gmailUser
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