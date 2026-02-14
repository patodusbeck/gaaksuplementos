const { Schema, model } = require("mongoose");

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    original: { type: Number, default: 0 },
    category: { type: String, default: "" },
    badge: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    collection: { type: String, enum: ["best-sellers", "launches"], default: "best-sellers" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = model("Product", ProductSchema);
