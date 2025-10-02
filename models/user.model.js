import { Schema, model } from "mongoose";
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, " User name is required"],
      minlength: [3, "User name must be at least 3 characters"],

      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      unique: [true, "User phone must be unique"],
      required: [true, "User phone is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "User password is required"],
      trim: true,
      minlength: [6, "User password must be at least 6 characters"],
    },

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
  },
  { timestamps: true }
);

// post middleware
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
