const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const { connectDb } = require("./db");
const { projectRoot } = require("./paths");
const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");
const uploadsRouter = require("./routes/uploads");
const couponsRouter = require("./routes/coupons");
const customersRouter = require("./routes/customers");
const authRouter = require("./routes/auth");

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : "*" }));
app.use(express.json({ limit: "1mb" }));

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 180,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

// Serve frontend files locally (index.html, admin.html, css, js)
app.use(express.static(projectRoot));
app.use("/uploads", express.static(path.join(projectRoot, "uploads")));

const requireDb = async (req, res, next) => {
  try {
    await connectDb();
    return next();
  } catch (err) {
    return res.status(500).json({ error: err.message || "Erro ao conectar no banco" });
  }
};

app.get("/", (req, res) => {
  res.sendFile(path.join(projectRoot, "index.html"));
});

app.get("/api/health", async (req, res) => {
  try {
    await connectDb();
    return res.json({ status: "ok", db: "connected" });
  } catch (err) {
    return res.status(500).json({ status: "error", db: "disconnected", message: err.message });
  }
});

app.use(["/api/products", "/products"], productsRouter);
app.use(["/api/orders", "/orders"], requireDb, ordersRouter);
app.use(["/api/coupons", "/coupons"], requireDb, couponsRouter);
app.use(["/api/customers", "/customers"], requireDb, customersRouter);
app.use(["/api/auth", "/auth"], requireDb, authRouter);
app.use(["/api/uploads", "/uploads-api"], uploadsRouter);

app.use((req, res) => {
  return res.status(404).json({ error: "Rota nao encontrada" });
});

app.use((err, req, res, next) => {
  console.error(err);
  return res.status(500).json({ error: err.message || "Erro interno" });
});

module.exports = app;
