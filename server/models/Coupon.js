const { Schema, model } = require("mongoose");

const CouponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    percent: { type: Number, required: true, min: 1, max: 100 },
    active: { type: Boolean, default: true },
    usageLimit: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = model("Coupon", CouponSchema);
