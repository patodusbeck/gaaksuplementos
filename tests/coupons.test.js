const test = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");
const request = require("supertest");

process.env.JWT_SECRET = "test-jwt-secret";

const couponsRouter = require("../server/routes/coupons");
const Coupon = require("../server/models/Coupon");
const { signToken } = require("./helpers");

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/coupons", couponsRouter);
  return app;
};

test("cupom validate retorna objeto valido", async () => {
  const app = buildApp();

  const originalUpdateMany = Coupon.updateMany;
  const originalFindOne = Coupon.findOne;

  Coupon.updateMany = async () => ({ acknowledged: true });
  Coupon.findOne = async ({ code }) => {
    if (code !== "GAAK15") return null;
    return {
      code: "GAAK15",
      percent: 15,
      usageLimit: 10,
      usedCount: 1,
      expiresAt: null,
      active: true,
    };
  };

  const res = await request(app).get("/api/coupons/validate?code=gaak15").expect(200);
  assert.equal(res.body.code, "GAAK15");
  assert.equal(res.body.percent, 15);

  Coupon.updateMany = originalUpdateMany;
  Coupon.findOne = originalFindOne;
});

test("rota de lista de cupons bloqueia gerente", async () => {
  const app = buildApp();
  const gerenteToken = signToken({ username: "gerente", role: "gerente" });

  await request(app)
    .get("/api/coupons")
    .set("Authorization", `Bearer ${gerenteToken}`)
    .expect(403)
    .expect((res) => {
      assert.equal(res.body.error, "Acesso negado");
    });
});
