const asyncHandler = require("express-async-handler");
const sharp = require("sharp");

const ProductModel = require("../models/product.model");
const {
  deleteOne,
  updateOne,
  getOne,
  createOne,
  getAll,
} = require("./handler-factory");
const {
  uploadMultipleFiles,
} = require("../middlewares/upload-file.middleware");

// upload Multiple images
exports.uploadProductImage = uploadMultipleFiles([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 3,
  },
]);

// image processing
exports.imageProcessing = asyncHandler(async (req, res, next) => {
  if (!req.files) return next(); // Image Processing for Image Cover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${
      req.files.imageCover[0].originalname.split(".")[0]
    }-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize({
        width: 2000,
        height: 2000,
      })
      .toFormat("jpeg")
      .jpeg({ quality: 80 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    // save image to database
    req.body.imageCover = imageCoverFileName;
  }

  // Image Processing for Images
  if (req.files.images) {
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageFileName = `product-${img.originalname.split(".")[0]}-${
          index + 1
        }.jpeg`;
        await sharp(img.buffer)
          .resize({
            width: 2000,
            height: 2000,
          })
          .toFormat("jpeg")
          .jpeg({ quality: 80 })
          .toFile(`uploads/products/${imageFileName}`);
        req.body.images.push(imageFileName);
      })
    );
  }

  next();
});

// @desc    Create Product
// @route   POST  /api/v1/products
// @access  Private
exports.createProduct = createOne(ProductModel, "Product");

// @desc    Update Specific Product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = updateOne(ProductModel, "Product");

// @desc    Delete Specific Product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = deleteOne(ProductModel, "Product");

// @desc    Get list of Products
// @route   GET /api/v1/products
// @access  Public
exports.getAllProducts = getAll(ProductModel, "Product", "ProductModel");

// @desc    Get Specific Product by id
// @route   GET /api/v1/products/:id
// @access  Public
exports.getSpecificProduct = getOne(ProductModel, "Product");
