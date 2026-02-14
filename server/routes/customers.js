const express = require("express");
const Customer = require("../models/Customer");

const router = express.Router();

router.get("/", async (req, res) => {
  const { q } = req.query;
  const query = {};
  if (q) {
    query.$or = [
      { name: { $regex: String(q), $options: "i" } },
      { phone: { $regex: String(q), $options: "i" } },
      { email: { $regex: String(q), $options: "i" } },
    ];
  }

  const customers = await Customer.find(query).sort({ updatedAt: -1 });
  res.json(customers);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).json({ error: "Cliente nao encontrado" });
  return res.json(customer);
});

router.put("/:id", async (req, res) => {
  const updates = { ...req.body };
  const customer = await Customer.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!customer) return res.status(404).json({ error: "Cliente nao encontrado" });
  return res.json(customer);
});

module.exports = router;
