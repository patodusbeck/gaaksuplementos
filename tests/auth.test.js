const test = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");
const request = require("supertest");
const bcrypt = require("bcryptjs");

process.env.JWT_SECRET = "test-jwt-secret";

const authRouter = require("../backend/server/routes/auth");
const AdminUser = require("../backend/server/models/AdminUser");
const seedAdminsService = require("../backend/server/services/seedAdmins");

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/admin-auth", authRouter);
  return app;
};

test("auth login e sessao /me", async () => {
  const app = buildApp();

  const originalFindOne = AdminUser.findOne;
  const originalSeed = seedAdminsService.ensureDefaultAdmins;

  const passwordHash = await bcrypt.hash("123456", 10);
  AdminUser.findOne = async ({ username }) => {
    if (username !== "admin") return null;
    return {
      _id: "507f1f77bcf86cd799439011",
      username: "admin",
      role: "owner",
      active: true,
      passwordHash,
    };
  };
  seedAdminsService.ensureDefaultAdmins = async () => {};

  const loginRes = await request(app)
    .post("/api/admin-auth/login")
    .send({ username: "admin", password: "123456" })
    .expect(200);

  assert.ok(loginRes.body.token, "token nao retornado");
  assert.equal(loginRes.body.user.username, "admin");

  await request(app)
    .get("/api/admin-auth/me")
    .set("Authorization", `Bearer ${loginRes.body.token}`)
    .expect(200)
    .expect((res) => {
      assert.equal(res.body.user.role, "owner");
    });

  AdminUser.findOne = originalFindOne;
  seedAdminsService.ensureDefaultAdmins = originalSeed;
});
