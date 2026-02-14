const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Coupon = require("../models/Coupon");
const Product = require("../models/Product");
const Customer = require("../models/Customer");

const router = express.Router();

const formatCurrency = (value) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const buildWhatsAppMessage = (order) => {
  const lines = [];
  lines.push("Pedido GAAK SUPLEMENTOS");
  lines.push(`Cliente: ${order.customerName}`);
  if (order.customerPhone) lines.push(`Telefone: ${order.customerPhone}`);
  if (order.couponCode) lines.push(`Cupom: ${order.couponCode} (${order.couponPercent}%)`);
  lines.push("Itens:");
  order.items.forEach((item) => {
    lines.push(`- ${item.name} x${item.quantity} (${formatCurrency(item.price)})`);
  });
  lines.push(`Subtotal: ${formatCurrency(order.subtotal)}`);
  if (order.discountCoupon > 0) lines.push(`Desconto cupom: ${formatCurrency(order.discountCoupon)}`);
  lines.push(`Total: ${formatCurrency(order.total)}`);
  if (order.notes) lines.push(`Observacoes: ${order.notes}`);
  return lines.join("\n");
};

const resolveItems = async (itemsPayload) => {
  const resolved = [];

  for (const item of itemsPayload) {
    const quantity = Number(item.quantity || 0);
    if (quantity <= 0) continue;

    const id = item.productId;
    if (id && mongoose.Types.ObjectId.isValid(String(id))) {
      const product = await Product.findById(id);
      if (product && product.active) {
        resolved.push({
          productId: product._id,
          name: product.name,
          price: Number(product.price),
          quantity,
        });
        continue;
      }
    }

    // Fallback para manter compatibilidade com payload antigo
    resolved.push({
      name: String(item.name || "Produto"),
      price: Number(item.price || 0),
      quantity,
    });
  }

  return resolved.filter((item) => item.price >= 0 && item.quantity > 0);
};

router.post("/", async (req, res) => {
  const { customerName, customerPhone, customerEmail, notes, items, couponCode } = req.body;

  if (!customerName || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Dados do pedido invalidos" });
  }

  const resolvedItems = await resolveItems(items);
  if (resolvedItems.length === 0) {
    return res.status(400).json({ error: "Itens do pedido invalidos" });
  }

  const subtotal = resolvedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let discountCoupon = 0;
  let couponPercent = 0;
  let normalizedCode = "";

  if (couponCode) {
    normalizedCode = String(couponCode).trim().toUpperCase();
    const coupon = await Coupon.findOne({ code: normalizedCode, active: true });
    if (coupon) {
      const now = new Date();
      const expired = coupon.expiresAt && coupon.expiresAt < now;
      const limitReached = coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit;
      if (!expired && !limitReached) {
        couponPercent = coupon.percent;
        discountCoupon = subtotal * (couponPercent / 100);
      }
    }
  }

  const total = Math.max(0, subtotal - discountCoupon);

  const phone = String(customerPhone || "").trim();
  const customerQuery = phone ? { phone } : { name: String(customerName).trim() };

  let customer = await Customer.findOne(customerQuery);
  if (!customer) {
    customer = await Customer.create({
      name: String(customerName).trim(),
      phone,
      email: String(customerEmail || "").trim(),
      notes: String(notes || "").trim(),
      ordersCount: 0,
      totalSpent: 0,
    });
  }

  const order = await Order.create({
    customerId: customer._id,
    customerName: String(customerName).trim(),
    customerPhone: phone,
    notes: String(notes || "").trim(),
    items: resolvedItems,
    subtotal,
    discountCoupon,
    couponCode: couponPercent ? normalizedCode : "",
    couponPercent,
    total,
  });

  customer.ordersCount += 1;
  customer.totalSpent += total;
  customer.lastOrderAt = new Date();
  if (customerEmail && !customer.email) customer.email = String(customerEmail).trim();
  await customer.save();

  if (couponPercent) {
    await Coupon.updateOne({ code: normalizedCode }, { $inc: { usedCount: 1 } });
  }

  const whatsappNumber = process.env.WHATSAPP_NUMBER || "5599984065730";
  const message = buildWhatsAppMessage(order);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return res.status(201).json({
    orderId: order._id,
    customerId: customer._id,
    whatsappUrl,
  });
});

router.get("/", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  return res.json(orders);
});

module.exports = router;
