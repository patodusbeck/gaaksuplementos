const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

router.get("/", async (req, res) => {
  const { collection, active } = req.query;
  const query = {};
  if (collection) query.collection = collection;
  if (active !== undefined) query.active = active === "true";

  const products = await Product.find(query).sort({ createdAt: -1 });
  res.json(products);
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: "Produto nao encontrado" });
  res.json(product);
});

router.post("/", async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

router.put("/:id", async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ error: "Produto nao encontrado" });
  res.json(product);
});

router.delete("/:id", async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ error: "Produto nao encontrado" });
  res.json({ ok: true });
});

module.exports = router;
