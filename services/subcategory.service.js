import asyncHandler from "express-async-handler";
import sharp from "sharp";

import { uploadSingleFile } from "../middlewares/upload-file.middleware.js";
import SubCategoryModel from "../models/subcategory.model.js";
import {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} from "./handler-factory.js";

export const uploadSubcategoryImage = uploadSingleFile("image");

export const imageProcessing = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();
  const fileName = `subcategory-${req.file.originalname.split(".")[0]}.jpeg`;
  await sharp(req.file.buffer)
    .resize({
      width: 200,
      height: 200,
    })
    .toFormat("jpeg")
    .jpeg({ quality: 80 })
    .toFile(`uploads/subcategories/${fileName}`);

  // save image to database
  req.body.image = fileName;
  next();
});
{
}

// @desc Nested Route
// @route POST /api/v1/categories/:categoryId/subcategories
// @access Private

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

export const createSubCategory = createOne(SubCategoryModel, "SubCategory");

export const updateSubCategory = updateOne(SubCategoryModel, "SubCategory");

export const deleteSubCategory = deleteOne(SubCategoryModel, "SubCategory");

export const getAllSubCategories = getAll(SubCategoryModel, "SubCategory");

export const getSpecificSubCategory = getOne(SubCategoryModel, "SubCategory");
