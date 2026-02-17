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
const { logger } = require("./observability/logger");
const { requestContext, requestLogger } = require("./observability/requestContext");
const { captureException } = require("./observability/monitoring");

const parseAllowedOrigins = () =>
  String(process.env.CORS_ORIGIN || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const buildCorsOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  const allowedOrigins = parseAllowedOrigins();

  if (isProduction) {
    if (allowedOrigins.length === 0 || allowedOrigins.includes("*")) {
      throw new Error("CORS_ORIGIN deve ser definido com dominios especificos em producao");
    }

    return {
      origin(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("CORS bloqueado para esta origem"));
      },
    };
  }

  if (allowedOrigins.length === 0) return { origin: "*" };
  return { origin: allowedOrigins };
};

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors(buildCorsOptions()));
app.use(express.json({ limit: "1mb" }));
app.use(requestContext);
app.use(requestLogger);

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 180,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

app.use(express.static(projectRoot));
app.use("/uploads", express.static(path.join(projectRoot, "uploads")));

const requireDb = async (req, res, next) => {
  try {
    await connectDb();
    return next();
  } catch (err) {
    captureException(err, { requestId: req.requestId, path: req.originalUrl || req.url });
    logger.error("db_connection_error", {
      requestId: req.requestId,
      path: req.originalUrl || req.url,
      error: err,
    });
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
app.use(["/api/admin-auth"], requireDb, authRouter);
app.use(["/api/uploads", "/uploads-api"], uploadsRouter);

app.use((req, res) => {
  logger.warn("route_not_found", {
    requestId: req.requestId,
    method: req.method,
    path: req.originalUrl || req.url,
  });
  return res.status(404).json({ error: "Rota nao encontrada" });
});

app.use((err, req, res, next) => {
  captureException(err, { requestId: req.requestId, path: req.originalUrl || req.url });
  logger.error("unhandled_error", {
    requestId: req.requestId,
    method: req.method,
    path: req.originalUrl || req.url,
    error: err,
  });
  return res.status(500).json({ error: err.message || "Erro interno" });
});

module.exports = app;
