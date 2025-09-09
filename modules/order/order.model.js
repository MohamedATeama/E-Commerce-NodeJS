import { model, Schema } from "mongoose";

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    items: [{
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number
    }],
    totalPrice: Number,
    shippingAddress: {
      city: String,
      street: String,
      phone: String
    },
    paymentType: { type: String, enum: ["cash", "card"], default: "cash" },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date
  },
  { timestamps: true, versionKey: false }
);

export const Order = model("Order", orderSchema);
