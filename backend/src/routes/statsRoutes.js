const express = require("express");
const { Product, Order } = require("../db");

function createStatsRoutes({ authMiddleware }) {
  const router = express.Router();

  router.get("/", authMiddleware, async (req, res) => {
    try {
      const [totalProducts, totalOrders, stockResult, recentOrders] =
        await Promise.all([
          Product.countDocuments(),
          Order.countDocuments(),
          Product.aggregate([
            { $group: { _id: null, total: { $sum: "$stock" } } },
          ]),
          Order.aggregate([
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$created_at" },
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: -1 } },
            { $limit: 30 },
            { $project: { _id: 0, date: "$_id", count: 1 } },
          ]),
        ]);

      res.json({
        totalProducts,
        totalOrders,
        totalStock: stockResult[0]?.total || 0,
        recentOrders,
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  return router;
}

module.exports = { createStatsRoutes };
