import { model, Schema } from "mongoose";

const subcategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: true,
      trim: true,
      minLength: 2,
    },
    slug: { type: String, lowercase: true, required: true },
    category: {type: Schema.Types.ObjectId, ref: "Category"},
    createdBy: {type: Schema.Types.ObjectId, ref: "User"}
  },
  { timestamps: true, versionKey: false }
);

export const Subcategory = model("Subcategory", subcategorySchema);
