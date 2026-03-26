const express = require("express");

const DEFAULT_EMAIL_SETTINGS = {
  enabled: false,
  smtpHost: "",
  smtpPort: "587",
  smtpUser: "",
  smtpPass: "",
  fromEmail: "",
  recipientEmail: "",
};

function createSettingsRoutes({ db, authMiddleware, emailService }) {
  const router = express.Router();

  router.get("/email", authMiddleware, (req, res) => {
    const row = db
      .prepare("SELECT value FROM settings WHERE key = ?")
      .get("email_notifications");
    res.json(row ? JSON.parse(row.value) : DEFAULT_EMAIL_SETTINGS);
  });

  router.put("/email", authMiddleware, (req, res) => {
    const value = JSON.stringify(req.body);
    db.prepare(
      "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?",
    ).run("email_notifications", value, value);
    res.json({ ok: true });
  });

  router.post("/email/test", authMiddleware, async (req, res) => {
    try {
      await emailService.sendTestEmail(req.body);
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
}

module.exports = { createSettingsRoutes };
