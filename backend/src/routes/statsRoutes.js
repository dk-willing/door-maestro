const express = require("express");

function createStatsRoutes({ db, authMiddleware }) {
  const router = express.Router();

  router.get("/", authMiddleware, (req, res) => {
    const totalProducts = db
      .prepare("SELECT COUNT(*) as c FROM products")
      .get().c;
    const totalOrders = db.prepare("SELECT COUNT(*) as c FROM orders").get().c;
    const totalStock = db
      .prepare("SELECT COALESCE(SUM(stock),0) as c FROM products")
      .get().c;
    const recentOrders = db
      .prepare(
        `
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM orders GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30
      `,
      )
      .all();

    res.json({ totalProducts, totalOrders, totalStock, recentOrders });
  });

  return router;
}

module.exports = { createStatsRoutes };
