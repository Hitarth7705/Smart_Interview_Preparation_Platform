const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const EmailConfig = require("../models/EmailConfig");
const { decrypt } = require("./encryption");
const nodemailer = require("nodemailer");
const EmailConfig = require("../models/EmailConfig");
const { decrypt } = require("./encryption");

const APP_NAME = process.env.MAIL_FROM_NAME || "Smart Interview Prep";
const SUBJECT = "Your Password Reset OTP";

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

// POST JSON over HTTPS (port 443) with a timeout. Works on Render's free tier,
// which blocks SMTP ports. Throws an Error carrying the provider's message.
const postJson = async (url, headers, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    throw new Error(
      data.message || data.error || `HTTP ${response.status}: ${text}`
    );
  }
  return data;
};

// ── Provider 1: Brevo (free: 300 emails/day, no custom domain needed) ──
const sendViaBrevo = async (toEmail, html) => {
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  if (!senderEmail) {
    throw new Error(
      "BREVO_SENDER_EMAIL is not set. It must be a sender address you verified in Brevo."
    );
  }

  const data = await postJson(
    "https://api.brevo.com/v3/smtp/email",
    { "api-key": process.env.BREVO_API_KEY },
    {
      sender: { name: APP_NAME, email: senderEmail },
      to: [{ email: toEmail }],
      subject: SUBJECT,
      htmlContent: html,
    }
  );

  console.log("OTP email sent via Brevo:", data.messageId);
  return data;
};

// ── Provider 2: Resend (free, but only delivers to other people once you
//    verify your own domain and set RESEND_FROM to an address on it) ──
const sendViaResend = async (toEmail, html) => {
  const fromEmail = process.env.RESEND_FROM;
  if (!fromEmail) {
    console.warn(
      "RESEND_FROM is not set: falling back to onboarding@resend.dev, which only delivers to your own Resend account email."
    );
  }

  const data = await postJson(
    "https://api.resend.com/emails",
    { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
    {
      from: `${APP_NAME} <${fromEmail || "onboarding@resend.dev"}>`,
      to: [toEmail],
      subject: SUBJECT,
      html,
    }
  );

  console.log("OTP email sent via Resend:", data.id);
  return data;
};

// Provider 3: Gmail API (HTTPS - works on Render Free)
const sendViaGmailApi = async (toEmail, html) => {
  const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN,
    GMAIL_SENDER_EMAIL,
  } = process.env;

  if (
    !GOOGLE_CLIENT_ID ||
    !GOOGLE_CLIENT_SECRET ||
    !GOOGLE_REFRESH_TOKEN ||
    !GMAIL_SENDER_EMAIL
  ) {
    throw new Error("Gmail API credentials are missing.");
  }

  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    refresh_token: GOOGLE_REFRESH_TOKEN,
  });

  const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client,
  });

  // Encode the subject and display name for email headers
  const encodeHeader = (value) =>
    `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;

  const message = [
    `From: ${encodeHeader(APP_NAME)} <${GMAIL_SENDER_EMAIL}>`,
    `To: ${toEmail}`,
    `Subject: ${encodeHeader(SUBJECT)}`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    Buffer.from(html, "utf8").toString("base64"),
  ].join("\r\n");

  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const response = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
    },
  });

  console.log("OTP email sent via Gmail API:", response.data.id);

  return response.data;
};

// ── Provider 3: Gmail SMTP (local development only; blocked on Render free) ──
const sendViaGmailSmtp = async (toEmail, html) => {
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
      console.warn(
        "Could not retrieve EmailConfig from DB, checking environment variables:",
        dbErr.message
      );
    }

    if (!gmailUser || !gmailPassword) {
      throw new Error(
        "No email provider configured. Set BREVO_API_KEY + BREVO_SENDER_EMAIL (recommended), or RESEND_API_KEY + RESEND_FROM, or MAIL_USER + MAIL_PASS for local development."
      );
    }

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
      from: { name: APP_NAME, address: gmailUser },
      to: toEmail,
      subject: SUBJECT,
      html,
    });

    console.log("OTP email sent via Gmail SMTP:", info.messageId);
    return info;
  } catch (error) {
    if (error.code === "ETIMEDOUT" || error.message.includes("timeout")) {
      console.error(
        "SMTP TIMEOUT: Render's free tier blocks outbound SMTP ports (25, 465, 587). Set BREVO_API_KEY and BREVO_SENDER_EMAIL instead."
      );
    }
    throw error;
  }
};

// Uses the first provider that has credentials. A configured provider that
// fails throws, so the route can report it instead of silently switching.
/* const sendOTPEmail = async (toEmail, otp) => {
  const html = getHtmlTemplate(otp);

  if (process.env.BREVO_API_KEY) return sendViaBrevo(toEmail, html);
  if (process.env.RESEND_API_KEY) return sendViaResend(toEmail, html);
  return sendViaGmailSmtp(toEmail, html);
}; */

const sendOTPEmail = async (toEmail, otp) => {
  const html = getHtmlTemplate(otp);

  // Priority 1: Gmail API (works on Render Free)
  if (
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REFRESH_TOKEN &&
    process.env.GMAIL_SENDER_EMAIL
  ) {
    return sendViaGmailApi(toEmail, html);
  }

  // Priority 2: Brevo
  if (process.env.BREVO_API_KEY) {
    return sendViaBrevo(toEmail, html);
  }

  // Priority 3: Resend
  if (process.env.RESEND_API_KEY) {
    return sendViaResend(toEmail, html);
  }

  // Local development only
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "No HTTPS email provider configured for production."
    );
  }

  return sendViaGmailSmtp(toEmail, html);
};

module.exports = { sendOTPEmail };
