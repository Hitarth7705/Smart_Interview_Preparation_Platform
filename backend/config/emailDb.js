const dns = require("node:dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");

const emailUri = process.env.EMAIL_MONGO_URI || process.env.MONGO_URI;

const emailDB = emailUri
  ? mongoose.createConnection(emailUri)
  : mongoose.connection;

if (emailUri) {
  emailDB.on("connected", () => {
    console.log("Email MongoDB Connected");
  });

  emailDB.on("error", (err) => {
    console.error("Email MongoDB Error:", err.message);
  });
}

module.exports = emailDB;
