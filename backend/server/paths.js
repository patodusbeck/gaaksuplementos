const path = require("path");

const backendRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(backendRoot, "..");
const publicRoot = path.join(repoRoot, "frontend", "public");
const dataRoot = path.join(backendRoot, "data");
const uploadsRoot = path.join(backendRoot, "uploads");

module.exports = { backendRoot, repoRoot, publicRoot, dataRoot, uploadsRoot };
