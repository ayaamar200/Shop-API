// @desc   Category Model for MongoDB using Mongoose
import { Schema, model } from "mongoose";
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "Category name must be unique"],
      trim: true,
      minlength: [3, "Category name must be at least 3 characters"],
      maxlength: [32, "Category name must be at most 32 characters"],
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
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

categorySchema.post("init", (doc) => {
  setImageUrl(doc);
});

categorySchema.post("save", (doc) => {
  setImageUrl(doc);
});

const CategoryModel = model("Category", categorySchema);
export default CategoryModel;
