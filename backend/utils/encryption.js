const crypto = require("crypto");

function getKey() {
  const ENCRYPTION_KEY = process.env.EMAIL_ENCRYPTION_KEY;
  if (!ENCRYPTION_KEY || !/^[0-9a-fA-F]{64}$/.test(ENCRYPTION_KEY)) {
    throw new Error("EMAIL_ENCRYPTION_KEY must be exactly 64 hexadecimal characters");
  }
  return Buffer.from(ENCRYPTION_KEY, "hex");
}

function encrypt(text) {
  const key = getKey();
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    encrypted,
    iv: iv.toString("hex"),
    authTag: cipher.getAuthTag().toString("hex")
  };
}

function decrypt(encrypted, iv, authTag) {
  const key = getKey();
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(iv, "hex")
  );

  decipher.setAuthTag(Buffer.from(authTag, "hex"));

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

module.exports = { encrypt, decrypt };
