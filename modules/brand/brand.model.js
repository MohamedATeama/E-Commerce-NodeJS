import { model, Schema } from "mongoose";

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: true,
      trim: true,
      minLength: 2,
    },
    slug: { type: String, lowercase: true, required: true },
    logo: String,
    createdBy: {type: Schema.Types.ObjectId, ref: "User"}
  },
  { timestamps: true, versionKey: false }
);

brandSchema.post('init', function(doc) {
  if (doc.logo && !doc.logo.includes(`${process.env.BASE_URL}`)) doc.logo = `${process.env.BASE_URL}/uploads/brands/${doc.logo}`
})

export const Brand = model("Brand", brandSchema);
