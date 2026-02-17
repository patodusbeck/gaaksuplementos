const { randomUUID } = require("crypto");
const { logger } = require("./logger");

const normalizeRequestId = (value) => String(value || "").trim().slice(0, 120);

const requestContext = (req, res, next) => {
  const inboundRequestId = normalizeRequestId(req.headers["x-request-id"]);
  const requestId = inboundRequestId || randomUUID();
  req.requestId = requestId;
  res.setHeader("x-request-id", requestId);
  next();
};

const requestLogger = (req, res, next) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - startedAt;
    const level = res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";
    logger[level]("request_completed", {
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl || req.url,
      statusCode: res.statusCode,
      durationMs,
      ip: req.ip,
      userAgent: req.headers["user-agent"] || "",
    });
  });

  next();
};

module.exports = { requestContext, requestLogger };
