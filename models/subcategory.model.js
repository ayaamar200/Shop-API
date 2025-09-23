// @desc   SubCategory Model for MongoDB using Mongoose
const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "SubCategory name is required"],
      unique: [true, "SubCategory name must be unique"],
      trim: true,
      minlength: [2, "SubCategory name must be at least 2 characters long"],
      maxlength: [50, "SubCategory name cannot exceed 50 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Parent Category ID is required"],
      index: true,
    },
  },
  { timestamps: true }
);

subCategorySchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  next();
});

const SubCategoryModel = mongoose.model("Subcategory", subCategorySchema);
module.exports = SubCategoryModel;
