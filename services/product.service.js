import asyncHandler from "express-async-handler";
import sharp from "sharp";

import ProductModel from "../models/product.model.js";
import {
  deleteOne,
  updateOne,
  getOne,
  createOne,
  getAll,
} from "./handler-factory.js";
import { uploadMultipleFiles } from "../middlewares/upload-file.middleware.js";

export const uploadProductImage = uploadMultipleFiles([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 3,
  },
]);

export const imageProcessing = asyncHandler(async (req, res, next) => {
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

// 1.Create SubCategory on Category
export function setCategoryIdToBody(req, res, next) {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
}

// 2.Get all Subcategories on Category
export function createFilterObj(req, res, next) {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
}

export const createProduct = createOne(ProductModel, "Product");

export const updateProduct = updateOne(ProductModel, "Product");

export const deleteProduct = deleteOne(ProductModel, "Product");

export const getAllProducts = getAll(ProductModel, "Product", "ProductModel");

export const getSpecificProduct = getOne(ProductModel, "Product", "reviews");
