import asyncHandler from "express-async-handler";
import sharp from "sharp";

import CategoryModel from "../models/category.model.js";
import { uploadSingleFile } from "../middlewares/upload-file.middleware.js";
import { deleteOne, updateOne, createOne, getOne, getAll } from "./handler-factory.js";

export const uploadCategoryImage = uploadSingleFile("image");

export const imageProcessing = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();
  const fileName = `category-${req.file.originalname.split(".")[0]}.jpeg`;
  await sharp(req.file.buffer)
    .resize({
      width: 400,
      height: 400,
    })
    .toFormat("jpeg")
    .jpeg({ quality: 80 })
    .toFile(`uploads/categories/${fileName}`);

  // save image to database
  req.body.image = fileName;
  next();
});
{
}

export const createCategory = createOne(CategoryModel, "Category");

export const updateCategory = updateOne(CategoryModel, "Category");

export const deleteCategory = deleteOne(CategoryModel, "Category");

export const getAllCategories = getAll(CategoryModel, "Category");

export const getSpecificCategory = getOne(CategoryModel, "Category");
