const base = {
  service: "gaak-api",
  env: String(process.env.NODE_ENV || "development"),
};

const sanitizeMeta = (meta = {}) => {
  const safe = {};
  Object.entries(meta).forEach(([key, value]) => {
    if (value instanceof Error) {
      safe[key] = {
        name: value.name,
        message: value.message,
        stack: value.stack,
      };
      return;
    }
    safe[key] = value;
  });
  return safe;
};

const write = (level, message, meta = {}) => {
  const payload = {
    ts: new Date().toISOString(),
    level,
    message,
    ...base,
    ...sanitizeMeta(meta),
  };

  const line = `${JSON.stringify(payload)}\n`;
  if (level === "error") {
    process.stderr.write(line);
    return;
  }
  process.stdout.write(line);
};

const logger = {
  info(message, meta) {
    write("info", message, meta);
  },
  warn(message, meta) {
    write("warn", message, meta);
  },
  error(message, meta) {
    write("error", message, meta);
  },
};

module.exports = { logger };
