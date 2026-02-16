const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const AdminUser = require("../models/AdminUser");
const { requireAuth } = require("../middleware/auth");
const seedAdminsService = require("../services/seedAdmins");
const { getJwtSecret } = require("../config/env");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas tentativas. Tente novamente em alguns minutos." },
});

router.post("/login", loginLimiter, async (req, res) => {
  await seedAdminsService.ensureDefaultAdmins();

  const username = String(req.body.username || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!username || !password) {
    return res.status(400).json({ error: "Informe usuario e senha" });
  }

  const user = await AdminUser.findOne({ username, active: true });
  if (!user) {
    return res.status(401).json({ error: "Usuario ou senha invalidos" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "Usuario ou senha invalidos" });
  }

  const token = jwt.sign(
    { sub: String(user._id), username: user.username, role: user.role },
    getJwtSecret(),
    { expiresIn: "12h" }
  );

  return res.json({
    token,
    user: { username: user.username, role: user.role },
  });
});

router.get("/me", requireAuth(["owner", "gerente"]), async (req, res) => {
  return res.json({ user: { username: req.auth.username, role: req.auth.role } });
});

module.exports = router;
