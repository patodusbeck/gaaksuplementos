const { logger } = require("./logger");

let sentry = null;
let monitoringEnabled = false;

const initMonitoring = () => {
  const dsn = String(process.env.SENTRY_DSN || "").trim();
  if (!dsn) return;

  try {
    // eslint-disable-next-line global-require
    sentry = require("@sentry/node");
    sentry.init({
      dsn,
      environment: String(process.env.NODE_ENV || "development"),
      tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0),
    });
    monitoringEnabled = true;
    logger.info("monitoring_initialized", { provider: "sentry" });
  } catch (err) {
    logger.warn("monitoring_init_failed", { error: err.message });
  }
};

const captureException = (error, context = {}) => {
  if (!monitoringEnabled || !sentry || !error) return;
  sentry.captureException(error, { extra: context });
};

module.exports = { initMonitoring, captureException };
