const path = require("path");
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

const env = {
  PORT: parseInt(process.env.PORT, 10) || 3001,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  JWT_SECRET: process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex"),
  DB_PATH:
    process.env.DB_PATH || path.join(__dirname, "..", "..", "doormaestro.db"),
  UPLOADS_DIR:
    process.env.UPLOADS_DIR || path.join(__dirname, "..", "..", "uploads"),
  MAX_UPLOAD_MB: parseInt(process.env.MAX_UPLOAD_MB, 10) || 10,
  DEFAULT_ADMIN_USERNAME: process.env.DEFAULT_ADMIN_USERNAME || "admin",
  DEFAULT_ADMIN_PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD || "admin123",
};

module.exports = env;
