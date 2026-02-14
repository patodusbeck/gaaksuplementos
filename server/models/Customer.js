const { Schema, model } = require("mongoose");

const CustomerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, default: "", trim: true, index: true },
    email: { type: String, default: "", trim: true, lowercase: true },
    notes: { type: String, default: "" },
    ordersCount: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastOrderAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = model("Customer", CustomerSchema);
