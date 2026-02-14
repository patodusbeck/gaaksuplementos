const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const router = express.Router();
const catalogPath = path.join(process.cwd(), "data", "products.json");

const readCatalog = async () => {
  const content = await fs.readFile(catalogPath, "utf8");
  const products = JSON.parse(content);
  if (!Array.isArray(products)) {
    throw new Error("Catalogo invalido: esperado array de produtos");
  }
  return products;
};

router.get("/", async (req, res) => {
  try {
    const { collection, active } = req.query;
    let products = await readCatalog();

    if (collection) {
      products = products.filter((item) => item.collection === collection);
    }

    if (active !== undefined) {
      const flag = active === "true";
      products = products.filter((item) => Boolean(item.active) === flag);
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Falha ao ler catalogo" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const products = await readCatalog();
    const product = products.find((item) => String(item.id) === String(req.params.id));
    if (!product) return res.status(404).json({ error: "Produto nao encontrado" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Falha ao ler catalogo" });
  }
});

router.all(["/", "/:id"], async (req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  return res.status(405).json({
    error: "Catalogo somente leitura. Edite data/products.json e publique por commit.",
  });
});

module.exports = router;
