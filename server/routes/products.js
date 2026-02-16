const express = require("express");
const { readCatalog } = require("../services/catalog");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { collection, active, q } = req.query;
    let products = await readCatalog();

    if (collection) {
      products = products.filter((item) => item.collection === collection);
    }

    if (active !== undefined) {
      const flag = active === "true";
      products = products.filter((item) => Boolean(item.active) === flag);
    }

    if (q) {
      const term = String(q).toLowerCase();
      products = products.filter((item) => String(item.name || "").toLowerCase().includes(term));
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
