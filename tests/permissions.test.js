const test = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");
const request = require("supertest");

process.env.JWT_SECRET = "test-jwt-secret";

const ordersRouter = require("../server/routes/orders");
const Order = require("../server/models/Order");
const { signToken } = require("./helpers");

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/orders", ordersRouter);
  return app;
};

test("permissoes: gerente pode ver vendas, anonimo nao", async () => {
  const app = buildApp();
  const originalFind = Order.find;

  Order.find = () => ({
    sort: async () => [{ _id: "order-1", total: 100 }],
  });

  const gerenteToken = signToken({ username: "gerente", role: "gerente" });

  await request(app)
    .get("/api/orders")
    .set("Authorization", `Bearer ${gerenteToken}`)
    .expect(200)
    .expect((res) => {
      assert.equal(Array.isArray(res.body), true);
      assert.equal(res.body.length, 1);
    });

  await request(app).get("/api/orders").expect(401);

  Order.find = originalFind;
});
