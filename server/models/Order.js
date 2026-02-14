const { Schema, model } = require("mongoose");

const OrderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: false },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, default: "", trim: true },
    customerStreet: { type: String, default: "", trim: true },
    customerNumber: { type: String, default: "", trim: true },
    customerNeighborhood: { type: String, default: "", trim: true },
    customerCity: { type: String, default: "", trim: true },
    customerComplement: { type: String, default: "", trim: true },
    couponCode: { type: String, default: "" },
    couponPercent: { type: Number, default: 0 },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    discountCoupon: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

module.exports = model("Order", OrderSchema);
