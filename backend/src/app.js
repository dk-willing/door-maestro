const express = require("express");
const cors = require("cors");

const env = require("./config/env");
const { initDb } = require("./db");
const { createAuthMiddleware } = require("./middleware/auth");
const { upload } = require("./middleware/upload");
const { createEmailService } = require("./services/emailService");
const { createAuthRoutes } = require("./routes/authRoutes");
const { createSettingsRoutes } = require("./routes/settingsRoutes");
const { createProductsRoutes } = require("./routes/productsRoutes");
const { createOrdersRoutes } = require("./routes/ordersRoutes");
const { createStatsRoutes } = require("./routes/statsRoutes");
const { createEmployeeRoutes } = require("./routes/employeeRoutes");

const app = express();

// Connect to MongoDB
initDb({
  mongoUri: env.MONGO_URI,
  defaultAdminUsername: env.DEFAULT_ADMIN_USERNAME,
  defaultAdminPassword: env.DEFAULT_ADMIN_PASSWORD,
}).catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
  process.exit(1);
});

const authMiddleware = createAuthMiddleware(env.JWT_SECRET);

const emailService = createEmailService();

const originValue = process.env.CORS_ORIGIN;

app.use(
  cors({
    origin:
      originValue === "*"
        ? true
        : originValue?.includes(",")
          ? originValue.split(",")
          : originValue,
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  "/api/auth",
  createAuthRoutes({ authMiddleware, jwtSecret: env.JWT_SECRET }),
);
app.use(
  "/api/settings",
  createSettingsRoutes({ authMiddleware, emailService }),
);
app.use("/api/employees", createEmployeeRoutes({ authMiddleware }));
app.use("/api/products", createProductsRoutes({ authMiddleware, upload }));
app.use("/api/orders", createOrdersRoutes({ authMiddleware, emailService }));
app.use("/api/stats", createStatsRoutes({ authMiddleware }));

module.exports = { app, env };
