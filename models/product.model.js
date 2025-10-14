// @desc   Brand Model for MongoDB using Mongoose
import { Schema, model } from "mongoose";
const productSchema = new Schema(
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
    // priceAfterDiscount: {
    //   type: Number,
    //   min: [0, "Product price after discount must be at least 0"],
    //   max: [2000000, "Product price after discount must be at most 2,000,000"],
    // },
    imageCover: {
      type: String,
      required: [true, "Product image cover is required"],
    },
    images: [String],
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to a category"],
    },
    subcategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subcategory",
      },
    ],
    brand: {
      type: Schema.Types.ObjectId,
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
  { timestamps: true, 
    // enable virtual populate fields
    toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

// Mongoose query middleware
productSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: "category",
      select: "name slug",
    },
    {
      path: "subcategories",
      select: "name slug",
    },
    {
      path: "brand",
      select: "name slug",
    },
  ]);
  next();
});

// post middleware
const setImageUrl = (doc) => {
  if (doc.imageCover) {
    const imageCoverUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageCoverUrl;
  }

  if (doc.images) {
    const imagesList = [];
    doc.images.forEach((img) => {
      const imageUrl = `${process.env.BASE_URL}/products/${img}`;
      imagesList.push(imageUrl);
    });
    doc.images = imagesList;
  }
};

productSchema.post("init", (doc) => {
  setImageUrl(doc);
});

productSchema.post("save", (doc) => {
  setImageUrl(doc);
});

const ProductModel = model("Product", productSchema);
export default ProductModel;
