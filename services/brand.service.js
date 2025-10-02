import asyncHandler from "express-async-handler";
import sharp from "sharp";

import { uploadSingleFile } from "../middlewares/upload-file.middleware.js";
import BrandModel from "../models/brand.model.js";
import { deleteOne, updateOne, createOne, getOne, getAll } from "./handler-factory.js";

export const uploadBrandImage = uploadSingleFile("image");

export const imageProcessing = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();
  const fileName = `brand-${req.file.originalname.split(".")[0]}.jpeg`;
  await sharp(req.file.buffer)
    .resize({
      width: 720,
      height: 200,
    })
    .toFormat("jpeg")
    .jpeg({ quality: 80 })
    .toFile(`uploads/brands/${fileName}`);

  // save image to database
  req.body.image = fileName;
  next();
});
{
}

export const createBrand = createOne(BrandModel, "Brand");

export const updateBrand = updateOne(BrandModel, "Brand");

export const deleteBrand = deleteOne(BrandModel, "Brand");

export const getAllBrands = getAll(BrandModel, "Brand");

export const getSpecificBrand = getOne(BrandModel, "Brand");
