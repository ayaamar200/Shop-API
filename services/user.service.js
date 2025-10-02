import asyncHandler from "express-async-handler";
import sharp from "sharp";

import { uploadSingleFile } from "../middlewares/upload-file.middleware.js";
import UserModel from "../models/user.model.js";
import {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} from "./handler-factory.js";

export const uploadUserImage = uploadSingleFile("profileImage");

export const imageProcessing = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();
  const fileName = `user-${req.file.originalname.split(".")[0]}.jpeg`;
  await sharp(req.file.buffer)
    .resize({
      width: 200,
      height: 200,
    })
    .toFormat("jpeg")
    .jpeg({ quality: 80 })
    .toFile(`uploads/users/${fileName}`);

  // save image to database
  req.body.profileImage = fileName;
  next();
});
{
}

export const createUser = createOne(UserModel, "User");

export const updateUser = updateOne(UserModel, "User");

export const deleteUser = deleteOne(UserModel, "User");

export const getAllUsers = getAll(UserModel, "User");

export const getSpecificUser = getOne(UserModel, "User");

// export const deactivateUser = deactivateOne(UserModel, "User");
