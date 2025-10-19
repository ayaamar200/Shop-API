import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, " User Name is required"],
      minlength: [3, "User Name must be at least 3 characters"],
      maxlength: [32, "User Name must be at most 32 characters"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    email: {
      type: String,
      unique: [true, "Email Address must be unique"],
      required: [true, "Email Address is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minlength: [6, "Password must be at least 6 characters"],
    },
    passwordChangedAt: Date,

    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,

    profileImage: String,

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // child references (1:M)
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "User must have a wishlist"],
      },
    ],

    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: {
          type: String,
          trim: true,
          default: "Home",
        },
        details: {
          type: String,
          required: true,
          trim: true,
          minlength: [5, "Address details must be at least 5 characters"],
        },
        phone: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
          trim: true,
        },
        governorate: {
          type: String,
          trim: true,
          default: "",
        },
        postalCode: Number,
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // Hashing User Password
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});
const setImageUrl = (doc) => {
  if (doc.profileImage) {
    const profileImageUrl = `${process.env.BASE_URL}/brands/${doc.profileImage}`;
    doc.profileImage = profileImageUrl;
  }
};

userSchema.post("init", (doc) => {
  setImageUrl(doc);
});

userSchema.post("save", (doc) => {
  setImageUrl(doc);
});

const UserModel = model("User", userSchema);

export default UserModel;
