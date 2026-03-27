const express = require("express");
const bcrypt = require("bcryptjs");
const { Employee } = require("../db");

function createEmployeeRoutes({ authMiddleware }) {
  const router = express.Router();

  // GET all employees
  router.get("/", authMiddleware, async (req, res) => {
    try {
      const employees = await Employee.find()
        .select("-password")
        .sort({ created_at: -1 });
      res.json(employees);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  });

  // POST create employee
  router.post("/", authMiddleware, async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password)
        return res
          .status(400)
          .json({ error: "Username and password required" });

      const exists = await Employee.findOne({ username });
      if (exists)
        return res.status(400).json({ error: "Username already taken" });

      const hash = await bcrypt.hash(password, 10);
      const employee = await Employee.create({
        username,
        password: hash,
        createdBy: req.admin.id,
      });

      res.json({ id: employee._id, username: employee.username });
    } catch (err) {
      res.status(500).json({ error: "Failed to create employee" });
    }
  });

  // DELETE employee
  router.delete("/:id", authMiddleware, async (req, res) => {
    try {
      await Employee.findByIdAndDelete(req.params.id);
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete employee" });
    }
  });

  // PUT reset employee password
  router.put("/:id/password", authMiddleware, async (req, res) => {
    try {
      const { password } = req.body;
      if (!password)
        return res.status(400).json({ error: "Password required" });
      const hash = await bcrypt.hash(password, 10);
      await Employee.findByIdAndUpdate(req.params.id, { password: hash });
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to reset password" });
    }
  });

  return router;
}

module.exports = { createEmployeeRoutes };
