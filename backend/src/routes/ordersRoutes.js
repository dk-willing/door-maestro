const express = require("express");
const { Order, Product } = require("../db");

function createOrdersRoutes({ authMiddleware, emailService }) {
  const router = express.Router();

  // GET all orders
  router.get("/", authMiddleware, async (req, res) => {
    try {
      const orders = await Order.find().sort({ created_at: -1 });
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // POST create order
  router.post("/", async (req, res) => {
    try {
      const { product_id, product_name, quantity, customer_name, phone, note } =
        req.body;

      const order = await Order.create({
        product_id,
        product_name: product_name || "",
        quantity,
        customer_name,
        phone,
        note: note || "",
      });

      res.json({ id: order._id });

      // Send email notification after responding
      const product = await Product.findById(product_id);
      emailService
        .sendOrderNotification(
          {
            product_name: product_name || "",
            quantity,
            customer_name,
            phone,
            note: note || "",
          },
          product,
        )
        .catch(() => {});
    } catch (err) {
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // PUT update order status
  router.put("/:id/status", authMiddleware, async (req, res) => {
    try {
      await Order.findByIdAndUpdate(req.params.id, { status: req.body.status });
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  return router;
}

module.exports = { createOrdersRoutes };
