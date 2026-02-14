const express = require("express");
const Coupon = require("../models/Coupon");

const router = express.Router();

router.get("/", async (req, res) => {
  const { active, code } = req.query;
  const query = {};
  if (code) query.code = String(code).toUpperCase();
  if (active !== undefined) query.active = active === "true";
  let coupons = await Coupon.find(query).sort({ createdAt: -1 });

  const now = new Date();
  const updates = coupons
    .filter(
      (coupon) =>
        coupon.active &&
        ((coupon.expiresAt && coupon.expiresAt < now) ||
          (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit))
    )
    .map((coupon) => coupon._id);

  if (updates.length) {
    await Coupon.updateMany({ _id: { $in: updates } }, { $set: { active: false } });
    coupons = await Coupon.find(query).sort({ createdAt: -1 });
  }

  res.json(coupons);
});

router.post("/", async (req, res) => {
  const payload = {
    code: String(req.body.code || "").toUpperCase(),
    percent: Number(req.body.percent || 0),
    active: req.body.active !== false,
    usageLimit: Number(req.body.usageLimit || 0),
    expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : null,
  };
  if (!payload.code || payload.percent <= 0) {
    return res.status(400).json({ error: "Dados invalidos" });
  }
  const exists = await Coupon.findOne({ code: payload.code });
  if (exists) return res.status(409).json({ error: "Cupom ja existe" });
  const coupon = await Coupon.create(payload);
  res.status(201).json(coupon);
});

router.put("/:id", async (req, res) => {
  const updates = { ...req.body };
  if (updates.code) updates.code = String(updates.code).toUpperCase();
  if (updates.expiresAt) updates.expiresAt = new Date(updates.expiresAt);
  if (updates.usageLimit !== undefined) updates.usageLimit = Number(updates.usageLimit || 0);
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!coupon) return res.status(404).json({ error: "Cupom nao encontrado" });
  res.json(coupon);
});

router.delete("/:id", async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) return res.status(404).json({ error: "Cupom nao encontrado" });
  res.json({ ok: true });
});

module.exports = router;
