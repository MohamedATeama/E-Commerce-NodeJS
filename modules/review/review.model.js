import { model, Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
      minLength: 2,
    },
    rate: { type: Number,required: true, min:0, max: 5 },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, versionKey: false }
);

reviewSchema.pre(/^find/, function () {
  this.populate("user", "name image")
})

export const Review = model("Review", reviewSchema);
