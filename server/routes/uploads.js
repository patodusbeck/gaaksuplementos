const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const router = express.Router();

const useCloudinary =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

let upload;

if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "gaak-suplementos",
      resource_type: "image",
    },
  });

  upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
  });
} else {
  const uploadDir = path.join(process.cwd(), "uploads");
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

  upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
  });
}

router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Arquivo nao enviado" });
  }

  const fileUrl = useCloudinary
    ? req.file.path
    : `/uploads/${req.file.filename}`;

  res.status(201).json({ url: fileUrl });
});

module.exports = router;
