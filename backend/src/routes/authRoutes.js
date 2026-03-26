const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Admin } = require("../db");

function createAuthRoutes({ authMiddleware, jwtSecret }) {
  const router = express.Router();

  // POST login
  router.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await Admin.findOne({ username });

      if (!admin || !(await bcrypt.compare(password, admin.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: admin._id, username: admin.username },
        jwtSecret,
        { expiresIn: "24h" },
      );
      res.json({ token, username: admin.username });
    } catch (err) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // GET me
  router.get("/me", authMiddleware, (req, res) => {
    res.json({ username: req.admin.username });
  });

  // PUT change password
  router.put("/password", authMiddleware, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const admin = await Admin.findById(req.admin.id);

      if (!(await bcrypt.compare(currentPassword, admin.password))) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

      admin.password = await bcrypt.hash(newPassword, 10);
      await admin.save();

      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to update password" });
    }
  });

  return router;
}

module.exports = { createAuthRoutes };
