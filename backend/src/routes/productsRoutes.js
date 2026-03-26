const express = require("express");
const { Product } = require("../db");
const { uploadToCloudinary } = require("../middleware/upload");

function createProductsRoutes({ authMiddleware, upload }) {
  const router = express.Router();

  // GET all products
  router.get("/", async (req, res) => {
    try {
      const products = await Product.find().sort({ created_at: -1 });
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // GET single product
  router.get("/:id", async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ error: "Not found" });
      res.json(product);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // POST create product
  router.post(
    "/",
    authMiddleware,
    upload.array("images", 10),
    async (req, res) => {
      try {
        const { name, price, description, material, size, country, stock } =
          req.body;

        const imageUrls = await Promise.all(
          (req.files || []).map((file) => uploadToCloudinary(file.buffer)),
        );

        const product = await Product.create({
          name,
          price: parseFloat(price),
          description: description || "",
          material: material || "",
          size: size || "",
          country: country || "",
          stock: parseInt(stock, 10) || 0,
          images: imageUrls.map((r) => r.secure_url),
        });

        res.json({ id: product._id });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create product" });
      }
    },
  );

  // PUT update product
  router.put(
    "/:id",
    authMiddleware,
    upload.array("images", 10),
    async (req, res) => {
      try {
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

        const newImageUrls = await Promise.all(
          (req.files || []).map((file) => uploadToCloudinary(file.buffer)),
        );

        const images = [...existing, ...newImageUrls.map((r) => r.secure_url)];

        await Product.findByIdAndUpdate(req.params.id, {
          name,
          price: parseFloat(price),
          description: description || "",
          material: material || "",
          size: size || "",
          country: country || "",
          stock: parseInt(stock, 10) || 0,
          images,
        });

        res.json({ ok: true });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update product" });
      }
    },
  );

  // PUT update stock only
  router.put("/:id/stock", authMiddleware, async (req, res) => {
    try {
      await Product.findByIdAndUpdate(req.params.id, {
        stock: parseInt(req.body.stock, 10),
      });
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to update stock" });
    }
  });

  // DELETE product
  router.delete("/:id", authMiddleware, async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  return router;
}

module.exports = { createProductsRoutes };
