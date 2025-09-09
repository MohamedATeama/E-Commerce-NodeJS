import { model, Schema } from "mongoose";

const cartSchema = new Schema(
  {
    user: {type: Schema.Types.ObjectId, ref: "User"},
    items: [{
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
      price: Number
    }],
    discount: Number,
    totalPrice: Number,
    totalPriceAfterDiscount: Number
  },
  { timestamps: true, versionKey: false }
);

export const Cart = model("Cart", cartSchema);
