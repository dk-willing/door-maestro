const express = require("express");
const { v4: uuidv4 } = require("uuid");

function createProductsRoutes({ db, authMiddleware, upload }) {
  const router = express.Router();

  router.get("/", (req, res) => {
    const products = db
      .prepare("SELECT * FROM products ORDER BY created_at DESC")
      .all();
    res.json(
      products.map((product) => ({
        ...product,
        images: JSON.parse(product.images),
      })),
    );
  });

  router.get("/:id", (req, res) => {
    const product = db
      .prepare("SELECT * FROM products WHERE id = ?")
      .get(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json({ ...product, images: JSON.parse(product.images) });
  });

  router.post("/", authMiddleware, upload.array("images", 10), (req, res) => {
    const { name, price, description, material, size, country, stock } =
      req.body;
    const id = uuidv4();
    const images = (req.files || []).map((file) => `/uploads/${file.filename}`);

    db.prepare(
      "INSERT INTO products (id, name, price, description, material, size, country, stock, images) VALUES (?,?,?,?,?,?,?,?,?)",
    ).run(
      id,
      name,
      parseFloat(price),
      description || "",
      material || "",
      size || "",
      country || "",
      parseInt(stock, 10) || 0,
      JSON.stringify(images),
    );

    res.json({ id });
  });

  router.put("/:id", authMiddleware, upload.array("images", 10), (req, res) => {
    const {
      name,
      price,
      description,
      material,
      size,
      country,
      stock,
      existingImages,
    } = req.body;
    const existing = existingImages ? JSON.parse(existingImages) : [];
    const newImages = (req.files || []).map(
      (file) => `/uploads/${file.filename}`,
    );
    const images = [...existing, ...newImages];

    db.prepare(
      "UPDATE products SET name=?, price=?, description=?, material=?, size=?, country=?, stock=?, images=? WHERE id=?",
    ).run(
      name,
      parseFloat(price),
      description || "",
      material || "",
      size || "",
      country || "",
      parseInt(stock, 10) || 0,
      JSON.stringify(images),
      req.params.id,
    );

    res.json({ ok: true });
  });

  router.put("/:id/stock", authMiddleware, (req, res) => {
    db.prepare("UPDATE products SET stock = ? WHERE id = ?").run(
      parseInt(req.body.stock, 10),
      req.params.id,
    );
    res.json({ ok: true });
  });

  router.delete("/:id", authMiddleware, (req, res) => {
    db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
    res.json({ ok: true });
  });

  return router;
}

module.exports = { createProductsRoutes };
