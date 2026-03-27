const path = require("path");
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", "..", "config.env") });

const env = {
  PORT: parseInt(process.env.PORT, 10) || 3001,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  JWT_SECRET: process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex"),
  MONGO_URI: process.env.MONGO_URI,
  DEFAULT_ADMIN_USERNAME: process.env.DEFAULT_ADMIN_USERNAME || "admin",
  DEFAULT_ADMIN_PASSWORD:
    process.env.DEFAULT_ADMIN_PASSWORD || "laryonSD@2026year",
};

module.exports = env;
