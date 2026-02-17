const fs = require("fs/promises");
const path = require("path");
const { projectRoot } = require("../paths");
const { logger } = require("../observability/logger");

const catalogPath = path.join(projectRoot, "data", "products.json");
const fallbackCatalogPath = path.resolve(process.cwd(), "data", "products.json");
const bundledCatalogPath = path.resolve(__dirname, "..", "..", "data", "products.json");
const catalogPaths = [catalogPath, fallbackCatalogPath, bundledCatalogPath];

const readFirstAvailableCatalog = async () => {
  let lastError = null;

  for (const filePath of catalogPaths) {
    try {
      const content = await fs.readFile(filePath, "utf8");
      return { content, sourcePath: filePath };
    } catch (err) {
      lastError = err;
      if (err && err.code !== "ENOENT") break;
    }
  }

  throw lastError || new Error("Catalogo nao encontrado");
};

const readCatalog = async () => {
  const { content, sourcePath } = await readFirstAvailableCatalog();
  const products = JSON.parse(content);
  if (!Array.isArray(products)) {
    throw new Error("Catalogo invalido: esperado array de produtos");
  }
  logger.info("catalog_loaded", { sourcePath, count: products.length });
  return products;
};

const readCatalogActiveMap = async () => {
  const items = await readCatalog();
  const map = new Map();

  items.forEach((item) => {
    if (!item || !item.id || item.active === false) return;
    map.set(String(item.id), item);
  });

  return map;
};

module.exports = { readCatalog, readCatalogActiveMap };
