const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { uploadsRoot } = require("../paths");

const router = express.Router();
const isVercel = Boolean(process.env.VERCEL);
const uploadDir = isVercel ? path.join("/tmp", "gaak-uploads") : uploadsRoot;

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Arquivo nao enviado" });
  }

  return res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

module.exports = router;
