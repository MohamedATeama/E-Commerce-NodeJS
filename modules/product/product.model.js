import { model, Schema } from "mongoose";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: 2,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
      minLength: 20,
      maxLength: 1000,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    priceAfterDiscount: {
      type: Number,
      min: 0,
    },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    subcategory: { type: Schema.Types.ObjectId, ref: "Subcategory" },
    brand: { type: Schema.Types.ObjectId, ref: "Brand" },
    slug: { type: String, lowercase: true, required: true },
    sold: Number,
    stock: { type: Number, min: 0 },
    cover: String,
    images: [String],
    rateAvg: { type: Number, min: 0, max: 5 },
    rateCount: Number,
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false, toJSON: {virtuals: true} }
);

productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product"
})

productSchema.pre("findOne", function () {
  this.populate("reviews")
})

productSchema.post("init", function (doc) {
  if (doc.cover && !doc.cover.includes(`${process.env.BASE_URL}`)) doc.cover = `${process.env.BASE_URL}/uploads/products/${doc.cover}`
  if (doc.images) doc.images = doc.images.map((image) => image.includes(`${process.env.BASE_URL}`) ? image : `${process.env.BASE_URL}/uploads/products/${image}`);
})

export const Product = model("Product", productSchema);
