// @desc   Brand Model for MongoDB using Mongoose
const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      minlength: [3, "Product title must be at least 3 characters"],
      maxlength: [100, "Product title must be at most 100 characters"],
      unique: [true, "Product title must be unique"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [20, "Product description must be at least 20 characters"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
      min: [0, "Product quantity must be at least 0"],
    },
    sold: {
      type: Number,
      default: 0,
      min: [0, "Product sold must be at least 0"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Product price must be at least 0"],
      max: [2000000, "Product price must be at most 2,000,000"],
    },
    priceAfterDiscount: {
      type: Number,
      min: [0, "Product price after discount must be at least 0"],
      max: [2000000, "Product price after discount must be at most 2,000,000"],
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Product image cover is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to a category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be at least 1.0"],
      max: [5, "Rating must be at most 5.0"],
      set: (val) => Math.round(val * 10) / 10, // Round to 1 decimal place
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
      min: [0, "Ratings quantity must be at least 0"],
    },
  },
  { timestamps: true }
);

// Mongoose query middleware
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  next();
});

const ProductModel = mongoose.model("Product", productSchema);
module.exports = ProductModel;
