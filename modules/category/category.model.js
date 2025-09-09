import { model, Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: true,
      trim: true,
      minLength: [2, "too short category name"],
    },
    slug: { type: String, lowercase: true, required: true },
    image: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false }
);

categorySchema.post('init', function (doc) {
  if (doc.image && !doc.image.includes(`${process.env.BASE_URL}`)) doc.image = `${process.env.BASE_URL}/uploads/categories/${doc.image}`
})

export const Category = model('Category', categorySchema);