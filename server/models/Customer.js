const { Schema, model } = require("mongoose");

const CustomerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, default: "", trim: true, index: true },
    email: { type: String, default: "", trim: true, lowercase: true },
    street: { type: String, default: "", trim: true },
    number: { type: String, default: "", trim: true },
    neighborhood: { type: String, default: "", trim: true },
    city: { type: String, default: "", trim: true },
    complement: { type: String, default: "", trim: true },
    ordersCount: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastOrderAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = model("Customer", CustomerSchema);
