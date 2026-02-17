const test = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");
const request = require("supertest");

process.env.JWT_SECRET = "test-jwt-secret";

const ordersRouter = require("../backend/server/routes/orders");
const Order = require("../backend/server/models/Order");
const Coupon = require("../backend/server/models/Coupon");
const Customer = require("../backend/server/models/Customer");
const catalogService = require("../backend/server/services/catalog");

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/orders", ordersRouter);
  app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message || "Erro interno" });
  });
  return app;
};

test("pedido ignora preco enviado pelo cliente e usa catalogo", async () => {
  const app = buildApp();

  const originalCatalog = catalogService.readCatalogActiveMap;
  const originalOrderCreate = Order.create;
  const originalCustomerFindOne = Customer.findOne;
  const originalCustomerCreate = Customer.create;
  const originalCouponFindOne = Coupon.findOne;
  const originalCouponUpdateOne = Coupon.updateOne;

  catalogService.readCatalogActiveMap = async () =>
    new Map([
      [
        "creatina-monohidratada-500g",
        { id: "creatina-monohidratada-500g", name: "Creatina Monohidratada 500g", price: 47.9, active: true },
      ],
    ]);

  let createdOrderPayload = null;
  Order.create = async (payload) => {
    createdOrderPayload = payload;
    return { _id: "order-1", ...payload };
  };

  Customer.findOne = async () => null;
  Customer.create = async (payload) => ({
    _id: "customer-1",
    ...payload,
    ordersCount: payload.ordersCount || 0,
    totalSpent: payload.totalSpent || 0,
    save: async () => {},
  });

  Coupon.findOne = async () => null;
  Coupon.updateOne = async () => ({ acknowledged: true });

  await request(app)
    .post("/api/orders")
    .send({
      customerName: "Kaio",
      customerPhone: "(99) 99999-9999",
      customerStreet: "Rua A",
      customerNeighborhood: "Centro",
      customerCity: "Cidade",
      items: [
        {
          productId: "creatina-monohidratada-500g",
          quantity: 2,
          name: "HACK",
          price: 0.01,
        },
      ],
    })
    .expect(201);

  assert.ok(createdOrderPayload, "Order.create nao foi chamado");
  assert.equal(createdOrderPayload.items[0].name, "Creatina Monohidratada 500g");
  assert.equal(createdOrderPayload.items[0].price, 47.9);
  assert.equal(createdOrderPayload.subtotal, 95.8);
  assert.equal(createdOrderPayload.total, 95.8);

  catalogService.readCatalogActiveMap = originalCatalog;
  Order.create = originalOrderCreate;
  Customer.findOne = originalCustomerFindOne;
  Customer.create = originalCustomerCreate;
  Coupon.findOne = originalCouponFindOne;
  Coupon.updateOne = originalCouponUpdateOne;
});

test("pedido retorna 500 quando leitura de catalogo falha", async () => {
  const app = buildApp();

  const originalCatalog = catalogService.readCatalogActiveMap;
  catalogService.readCatalogActiveMap = async () => {
    const err = new Error("no such file or directory");
    err.code = "ENOENT";
    throw err;
  };

  const response = await request(app).post("/api/orders").send({
    customerName: "Kaio",
    customerStreet: "Rua A",
    customerNeighborhood: "Centro",
    customerCity: "Cidade",
    items: [{ productId: "x", quantity: 1 }],
  });

  assert.equal(response.status, 500);
  assert.ok(response.body.error, "esperado payload de erro");

  catalogService.readCatalogActiveMap = originalCatalog;
});
