const express = require("express");
const { Setting } = require("../db");

const DEFAULT_EMAIL_SETTINGS = {
  enabled: false,
  smtpHost: "",
  smtpPort: "587",
  smtpUser: "",
  smtpPass: "",
  fromEmail: "",
  recipientEmail: "",
};

function createSettingsRoutes({ authMiddleware, emailService }) {
  const router = express.Router();

  // GET email settings
  router.get("/email", authMiddleware, async (req, res) => {
    try {
      const setting = await Setting.findOne({ key: "email_notifications" });
      res.json(setting ? JSON.parse(setting.value) : DEFAULT_EMAIL_SETTINGS);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch email settings" });
    }
  });

  // PUT save email settings
  router.put("/email", authMiddleware, async (req, res) => {
    try {
      await Setting.findOneAndUpdate(
        { key: "email_notifications" },
        { value: JSON.stringify(req.body) },
        { upsert: true, new: true },
      );
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to save email settings" });
    }
  });

  // POST test email
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
