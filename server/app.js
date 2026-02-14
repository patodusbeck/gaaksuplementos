const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectDb } = require("./db");
const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");
const uploadsRouter = require("./routes/uploads");
const couponsRouter = require("./routes/coupons");

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : "*" }));
app.use(express.json({ limit: "1mb" }));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const requireDb = async (req, res, next) => {
  try {
    await connectDb();
    return next();
  } catch (err) {
    return res.status(500).json({ error: err.message || "Erro ao conectar no banco" });
  }
};

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.use(["/api/products", "/products"], productsRouter);
app.use(["/api/orders", "/orders"], requireDb, ordersRouter);
app.use(["/api/coupons", "/coupons"], requireDb, couponsRouter);
app.use(["/api/uploads", "/uploads-api"], uploadsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Erro interno" });
});

module.exports = app;
