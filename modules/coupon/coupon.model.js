import { model, Schema } from "mongoose";

const couponSchema = new Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    discount: { type: Number, required: true },
    expire: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false }
);

export const Coupon = model("Coupon", couponSchema);
