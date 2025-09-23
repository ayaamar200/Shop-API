// @desc   Brand Model for MongoDB using Mongoose
const mongoose = require("mongoose");
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: [true, "Brand name must be unique"],
      trim: true,
      minlength: [3, "Brand name must be at least 3 characters"],
      maxlength: [32, "Brand name must be at most 32 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

// post middleware
const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

brandSchema.post("init", (doc) => {
  setImageUrl(doc);
});

brandSchema.post("save", (doc) => {
  setImageUrl(doc);
});

const BrandModel = mongoose.model("Brand", brandSchema);
module.exports = BrandModel;
