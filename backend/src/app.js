const express = require("express");
const cors = require("cors");
const fs = require("fs");

const env = require("./config/env");
const { initDb } = require("./db");
const { createAuthMiddleware } = require("./middleware/auth");
const { createUploadMiddleware } = require("./middleware/upload");
const { createEmailService } = require("./services/emailService");
const { createAuthRoutes } = require("./routes/authRoutes");
const { createSettingsRoutes } = require("./routes/settingsRoutes");
const { createProductsRoutes } = require("./routes/productsRoutes");
const { createOrdersRoutes } = require("./routes/ordersRoutes");
const { createStatsRoutes } = require("./routes/statsRoutes");

if (!fs.existsSync(env.UPLOADS_DIR)) {
  fs.mkdirSync(env.UPLOADS_DIR, { recursive: true });
}

const db = initDb({
  dbPath: env.DB_PATH,
  defaultAdminUsername: env.DEFAULT_ADMIN_USERNAME,
  defaultAdminPassword: env.DEFAULT_ADMIN_PASSWORD,
});

const app = express();
const authMiddleware = createAuthMiddleware(env.JWT_SECRET);
const upload = createUploadMiddleware({
  uploadsDir: env.UPLOADS_DIR,
  maxUploadMb: env.MAX_UPLOAD_MB,
});
const emailService = createEmailService(db);

app.use(cors({ origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN }));
app.use(express.json());
app.use("/uploads", express.static(env.UPLOADS_DIR));

app.use(
  "/api/auth",
  createAuthRoutes({ db, authMiddleware, jwtSecret: env.JWT_SECRET }),
);
app.use(
  "/api/settings",
  createSettingsRoutes({ db, authMiddleware, emailService }),
);
app.use("/api/products", createProductsRoutes({ db, authMiddleware, upload }));
app.use(
  "/api/orders",
  createOrdersRoutes({ db, authMiddleware, emailService }),
);
app.use("/api/stats", createStatsRoutes({ db, authMiddleware }));

module.exports = { app, env };
