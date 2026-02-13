const express = require("express");
const Order = require("../models/Order");
const Coupon = require("../models/Coupon");

const router = express.Router();

const formatCurrency = (value) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const buildWhatsAppMessage = (order) => {
  const lines = [];
  lines.push(`Pedido GAAK SUPLEMENTOS`);
  lines.push(`Cliente: ${order.customerName}`);
  if (order.customerPhone) lines.push(`Telefone: ${order.customerPhone}`);
  if (order.couponCode) lines.push(`Cupom: ${order.couponCode} (${order.couponPercent}%)`);
  lines.push("Itens:");
  order.items.forEach((item) => {
    lines.push(`- ${item.name} x${item.quantity} (${formatCurrency(item.price)})`);
  });
  lines.push(`Subtotal: ${formatCurrency(order.subtotal)}`);
  if (order.discountCoupon > 0) {
    lines.push(`Desconto cupom: ${formatCurrency(order.discountCoupon)}`);
  }
  lines.push(`Total: ${formatCurrency(order.total)}`);
  if (order.notes) lines.push(`Observacoes: ${order.notes}`);
  return lines.join("\n");
};

router.post("/", async (req, res) => {
  const { customerName, customerPhone, notes, items, couponCode } = req.body;

  if (!customerName || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Dados do pedido invalidos" });
  }

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let discountCoupon = 0;
  let couponPercent = 0;
  let normalizedCode = "";
  if (couponCode) {
    normalizedCode = String(couponCode).trim().toUpperCase();
    const coupon = await Coupon.findOne({ code: normalizedCode, active: true });
    if (coupon) {
      const now = new Date();
      const isExpired = coupon.expiresAt && coupon.expiresAt < now;
      const isLimitReached = coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit;
      if (!isExpired && !isLimitReached) {
        couponPercent = coupon.percent;
        discountCoupon = subtotal * (coupon.percent / 100);
      }
    }
  }

  const total = subtotal - discountCoupon;

  const order = await Order.create({
    customerName,
    customerPhone: customerPhone || "",
    notes: notes || "",
    items,
    subtotal,
    discountCoupon,
    couponCode: couponPercent ? normalizedCode : "",
    couponPercent,
    total,
  });

  if (couponPercent) {
    await Coupon.updateOne({ code: normalizedCode }, { $inc: { usedCount: 1 } });
  }

  const whatsappNumber = process.env.WHATSAPP_NUMBER || "5599984065730";
  const message = buildWhatsAppMessage(order);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  res.status(201).json({
    orderId: order._id,
    whatsappUrl,
  });
});

router.get("/", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

module.exports = router;
