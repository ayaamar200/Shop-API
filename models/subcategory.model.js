// @desc   SubCategory Model for MongoDB using Mongoose
import { Schema, model } from "mongoose";

const subCategorySchema = new Schema(
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
    image: String,
    category: {
      type: Schema.Types.ObjectId,
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
    select: "name slug",
  });
  next();
});

// post middleware
const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/subcategories/${doc.image}`;
    doc.image = imageUrl;
  }
};

subCategorySchema.post("init", (doc) => {
  setImageUrl(doc);
});

subCategorySchema.post("save", (doc) => {
  setImageUrl(doc);
});

const SubCategoryModel = model("Subcategory", subCategorySchema);
export default SubCategoryModel;
