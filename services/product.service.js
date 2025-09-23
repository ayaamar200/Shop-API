const ProductModel = require("../models/product.model");
const {
  deleteOne,
  updateOne,
  getOne,
  createOne,
  getAll,
} = require("./handler-factory");

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
