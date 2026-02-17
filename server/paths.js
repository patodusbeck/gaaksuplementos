const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const publicRoot = path.join(projectRoot, "public");
const dataRoot = path.join(projectRoot, "data");

module.exports = { projectRoot, publicRoot, dataRoot };
