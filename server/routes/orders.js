const express = require("express");
const Order = require("../models/Order");
const Coupon = require("../models/Coupon");
const Customer = require("../models/Customer");
const { requireAuth } = require("../middleware/auth");
const catalogService = require("../services/catalog");

const router = express.Router();

const formatCurrency = (value) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const normalizeText = (value) => String(value || "").trim();

const buildAddressLine = (source) => {
  const street = normalizeText(source.customerStreet || source.street);
  const number = normalizeText(source.customerNumber || source.number);
  const neighborhood = normalizeText(source.customerNeighborhood || source.neighborhood);
  const city = normalizeText(source.customerCity || source.city);
  const complement = normalizeText(source.customerComplement || source.complement);

  const parts = [];
  if (street) parts.push(number ? `${street}, ${number}` : street);
  if (neighborhood) parts.push(`Bairro: ${neighborhood}`);
  if (city) parts.push(`Cidade: ${city}`);
  if (complement) parts.push(`Complemento: ${complement}`);
  return parts.join(" | ");
};

const buildWhatsAppMessage = (order) => {
  const lines = [];
  lines.push("Pedido GAAK SUPLEMENTOS");
  lines.push(`Cliente: ${order.customerName}`);
  if (order.customerPhone) lines.push(`Telefone: ${order.customerPhone}`);

  const address = buildAddressLine(order);
  if (address) lines.push(`Endereco: ${address}`);

  if (order.couponCode) lines.push(`Cupom: ${order.couponCode} (${order.couponPercent}%)`);
  lines.push("Itens:");
  order.items.forEach((item) => {
    lines.push(`- ${item.name} x${item.quantity} (${formatCurrency(item.price)})`);
  });
  lines.push(`Subtotal: ${formatCurrency(order.subtotal)}`);
  if (order.discountCoupon > 0) lines.push(`Desconto cupom: ${formatCurrency(order.discountCoupon)}`);
  lines.push(`Total: ${formatCurrency(order.total)}`);
  return lines.join("\n");
};

const resolveItems = async (itemsPayload) => {
  const catalogMap = await catalogService.readCatalogActiveMap();
  const resolved = [];

  for (const item of itemsPayload) {
    const quantity = Number(item.quantity || 0);
    if (!Number.isFinite(quantity) || quantity <= 0) continue;

    const productId = String(item.productId || item.id || "").trim();
    if (!productId) continue;

    const product = catalogMap.get(productId);
    if (!product) continue;

    resolved.push({
      productId,
      name: String(product.name || "Produto"),
      price: Number(product.price || 0),
      quantity,
    });
  }

  return resolved.filter((item) => item.price >= 0 && item.quantity > 0);
};

router.post("/", async (req, res) => {
  const {
    customerName,
    customerPhone,
    customerEmail,
    customerStreet,
    customerNumber,
    customerNeighborhood,
    customerCity,
    customerComplement,
    items,
    couponCode,
  } = req.body;

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

  const phone = normalizeText(customerPhone);
  const customerQuery = phone ? { phone } : { name: normalizeText(customerName) };

  const addressPayload = {
    street: normalizeText(customerStreet),
    number: normalizeText(customerNumber),
    neighborhood: normalizeText(customerNeighborhood),
    city: normalizeText(customerCity),
    complement: normalizeText(customerComplement),
  };

  let customer = await Customer.findOne(customerQuery);
  if (!customer) {
    customer = await Customer.create({
      name: normalizeText(customerName),
      phone,
      email: normalizeText(customerEmail),
      ...addressPayload,
      ordersCount: 0,
      totalSpent: 0,
    });
  }

  const order = await Order.create({
    customerId: customer._id,
    customerName: normalizeText(customerName),
    customerPhone: phone,
    customerStreet: addressPayload.street,
    customerNumber: addressPayload.number,
    customerNeighborhood: addressPayload.neighborhood,
    customerCity: addressPayload.city,
    customerComplement: addressPayload.complement,
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
  if (customerEmail && !customer.email) customer.email = normalizeText(customerEmail);
  if (addressPayload.street) customer.street = addressPayload.street;
  if (addressPayload.number) customer.number = addressPayload.number;
  if (addressPayload.neighborhood) customer.neighborhood = addressPayload.neighborhood;
  if (addressPayload.city) customer.city = addressPayload.city;
  if (addressPayload.complement) customer.complement = addressPayload.complement;
  await customer.save();

  if (couponPercent) {
    await Coupon.updateOne({ code: normalizedCode }, { $inc: { usedCount: 1 } });
  }

  const whatsappNumber = String(process.env.WHATSAPP_NUMBER || "5599984065730").replace(/\D/g, "");
  const message = buildWhatsAppMessage(order);
  const encoded = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encoded}`;
  const whatsappDeepLink = `whatsapp://send?phone=${whatsappNumber}&text=${encoded}`;

  return res.status(201).json({
    orderId: order._id,
    customerId: customer._id,
    whatsappUrl,
    whatsappDeepLink,
  });
});

router.get("/", requireAuth(["owner", "gerente"]), async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  return res.json(orders);
});

module.exports = router;
