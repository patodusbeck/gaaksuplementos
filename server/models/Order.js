const { Schema, model } = require("mongoose");

const OrderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, default: "" },
    notes: { type: String, default: "" },
    couponCode: { type: String, default: "" },
    couponPercent: { type: Number, default: 0 },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    discountCoupon: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = model("Order", OrderSchema);
