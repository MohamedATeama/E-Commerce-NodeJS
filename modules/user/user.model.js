import { model, Schema } from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
      minLength: 2,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      trim: true,
      minLength: 8,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    confirmEmail: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    image: { type: String, default: "user.jpg" },
    passwordChangedAt: Date,
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    addresses: [{
      city: String,
      phone: String,
      street: String
    }]
  },
  { timestamps: true, versionKey: false }
);

userSchema.pre("save", function () {
  this.password = bcrypt.hashSync(this.password, 8)
})

userSchema.pre("findOneAndUpdate", function () {
  if (this._update.password) this._update.password = bcrypt.hashSync(this._update.password, 8)
})

userSchema.post("init", function(doc) {
  if (doc.image && !doc.image.includes(`${process.env.BASE_URL}`)) doc.image = `${process.env.BASE_URL}/uploads/users/${doc.image}`
})

export const User = model("User", userSchema);
