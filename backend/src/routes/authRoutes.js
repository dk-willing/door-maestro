const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function createAuthRoutes({ db, authMiddleware, jwtSecret }) {
  const router = express.Router();

  router.post("/login", (req, res) => {
    const { username, password } = req.body;
    const admin = db
      .prepare("SELECT * FROM admins WHERE username = ?")
      .get(username);

    if (!admin || !bcrypt.compareSync(password, admin.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      jwtSecret,
      { expiresIn: "24h" },
    );
    res.json({ token, username: admin.username });
  });

  router.get("/me", authMiddleware, (req, res) => {
    res.json({ username: req.admin.username });
  });

  router.put("/password", authMiddleware, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const admin = db
      .prepare("SELECT * FROM admins WHERE id = ?")
      .get(req.admin.id);

    if (!bcrypt.compareSync(currentPassword, admin.password)) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    const hash = bcrypt.hashSync(newPassword, 10);
    db.prepare("UPDATE admins SET password = ? WHERE id = ?").run(
      hash,
      req.admin.id,
    );
    res.json({ ok: true });
  });

  return router;
}

module.exports = { createAuthRoutes };
