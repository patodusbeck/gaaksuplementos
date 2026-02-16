const fs = require("fs/promises");
const path = require("path");
const { projectRoot } = require("../paths");

const catalogPath = path.join(projectRoot, "data", "products.json");

const readCatalog = async () => {
  const content = await fs.readFile(catalogPath, "utf8");
  const products = JSON.parse(content);
  if (!Array.isArray(products)) {
    throw new Error("Catalogo invalido: esperado array de produtos");
  }
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
