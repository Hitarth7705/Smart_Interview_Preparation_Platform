const nodemailer = require("nodemailer");
const EmailConfig = require("../models/EmailConfig");
const { decrypt } = require("./encryption");

const getHtmlTemplate = (otp) => `
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
`;

const sendOTPEmail = async (toEmail, otp) => {
  const html = getHtmlTemplate(otp);

  // 1. Resend HTTP API (Port 443 HTTPS - works 100% on Render Free Tier)
  if (process.env.RESEND_API_KEY) {
    try {
      const fromEmail = process.env.RESEND_FROM || "onboarding@resend.dev";
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `Smart Interview Prep <${fromEmail}>`,
          to: [toEmail],
          subject: "Your Password Reset OTP",
          html,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || JSON.stringify(data));
      }
      console.log("OTP email sent successfully via Resend API:", data.id);
      return data;
    } catch (apiErr) {
      console.error("Resend API error:", apiErr.message);
      throw apiErr;
    }
  }

  // 2. SendGrid HTTP API (Port 443 HTTPS)
  if (process.env.SENDGRID_API_KEY) {
    try {
      const fromEmail = process.env.SENDGRID_FROM_EMAIL || process.env.MAIL_USER || "noreply@smartinterviewprep.com";
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: toEmail }] }],
          from: { email: fromEmail, name: "Smart Interview Prep" },
          subject: "Your Password Reset OTP",
          content: [{ type: "text/html", value: html }],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`SendGrid API failed: ${errorText}`);
      }
      console.log("OTP email sent successfully via SendGrid API");
      return { success: true };
    } catch (sgErr) {
      console.error("SendGrid API error:", sgErr.message);
      throw sgErr;
    }
  }

  // 3. Fallback to Gmail SMTP / Nodemailer (Works locally; blocked on Render Free Tier)
  try {
    let gmailUser = process.env.MAIL_USER;
    let gmailPassword = process.env.MAIL_PASS;

    // Check if EmailConfig is present in MongoDB
    try {
      const config = await EmailConfig.findOne({ provider: "Gmail" });
      if (config && config.encryptedPassword && process.env.EMAIL_ENCRYPTION_KEY) {
        gmailUser = config.gmailUser;
        gmailPassword = decrypt(
          config.encryptedPassword,
          config.iv,
          config.authTag
        );
      }
    } catch (dbErr) {
      console.warn("Could not retrieve EmailConfig from DB, checking environment variables:", dbErr.message);
    }

    if (!gmailUser || !gmailPassword) {
      throw new Error(
        "Gmail credentials not found. On Render Free Tier, SMTP (ports 465/587) is blocked. Add RESEND_API_KEY (recommended) or set MAIL_USER and MAIL_PASS."
      );
    }

    // Configure Gmail SMTP with timeout limit
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPassword.replace(/\s/g, ""),
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    const info = await transporter.sendMail({
      from: {
        name: "Smart Interview Prep",
        address: gmailUser,
      },
      to: toEmail,
      subject: "Your Password Reset OTP",
      html,
    });

    console.log("Gmail OTP sent successfully via SMTP:", info.messageId);
    return info;

  } catch (error) {
    if (error.code === "ETIMEDOUT" || error.message.includes("timeout")) {
      console.error(
        "SMTP TIMEOUT DETECTED: Render Free Tier blocks outbound SMTP ports (25, 465, 587). Please use an HTTP email API like Resend (set RESEND_API_KEY) or upgrade Render plan."
      );
    }
    console.error("GMAIL OTP ERROR:", error.message);
    throw error;
  }
};

module.exports = { sendOTPEmail };
