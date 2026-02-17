require("dotenv").config();
const app = require("./app");
const { validateStartupEnv } = require("./config/env");
const { initMonitoring } = require("./observability/monitoring");
const { logger } = require("./observability/logger");

validateStartupEnv();
initMonitoring();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info("server_started", { port: Number(PORT) });
});
