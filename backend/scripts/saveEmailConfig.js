
require("dotenv").config();

const emailDB = require("../config/emailDb");
const EmailConfig = require("../models/EmailConfig");
const { encrypt } = require("../utils/encryption");

async function saveEmailConfig() {
  try {
    await emailDB.asPromise();

    const gmailUser = process.env.GMAIL_USER;
    const gmailPassword = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailPassword) {
      throw new Error("Gmail credentials are missing");
    }

    const encryptedData = encrypt(
      gmailPassword.replace(/\s/g, "")
    );

    const result = await EmailConfig.findOneAndUpdate(
      { provider: "Gmail" },
      {
        $set: {
          provider: "Gmail",
          gmailUser: gmailUser,
          encryptedPassword: encryptedData.encrypted,
          iv: encryptedData.iv,
          authTag: encryptedData.authTag
        }
      },
      {
        upsert: true,
        new: true,
        runValidators: true
      }
    );

    console.log("Gmail configuration saved successfully!");
    console.log("Provider:", result.provider);
    console.log("Email:", result.gmailUser);
    console.log("Encrypted password stored:", !!result.encryptedPassword);

  } catch (error) {
    console.error("SAVE CONFIG ERROR:", error.message);
    process.exitCode = 1;
  } finally {
    await emailDB.close();
  }
}

saveEmailConfig();
