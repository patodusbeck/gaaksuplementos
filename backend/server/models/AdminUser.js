const { Schema, model } = require("mongoose");

const AdminUserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["owner", "gerente"], required: true, index: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = model("AdminUser", AdminUserSchema);
