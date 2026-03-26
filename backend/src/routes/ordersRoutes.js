const express = require("express");
const { v4: uuidv4 } = require("uuid");

function createOrdersRoutes({ db, authMiddleware, emailService }) {
  const router = express.Router();

  router.get("/", authMiddleware, (req, res) => {
    const orders = db
      .prepare("SELECT * FROM orders ORDER BY created_at DESC")
      .all();
    res.json(orders);
  });

  router.post("/", (req, res) => {
    const { product_id, product_name, quantity, customer_name, phone, note } =
      req.body;
    const id = uuidv4();

    db.prepare(
      "INSERT INTO orders (id, product_id, product_name, quantity, customer_name, phone, note) VALUES (?,?,?,?,?,?,?)",
    ).run(
      id,
      product_id,
      product_name || "",
      quantity,
      customer_name,
      phone,
      note || "",
    );

    res.json({ id });

    const product = db
      .prepare("SELECT * FROM products WHERE id = ?")
      .get(product_id);
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
  });

  router.put("/:id/status", authMiddleware, (req, res) => {
    db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(
      req.body.status,
      req.params.id,
    );
    res.json({ ok: true });
  });

  return router;
}

module.exports = { createOrdersRoutes };
