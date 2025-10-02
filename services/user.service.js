import asyncHandler from "express-async-handler";
import sharp from "sharp";
import bcrypt from "bcrypt";

import { uploadSingleFile } from "../middlewares/upload-file.middleware.js";
import UserModel from "../models/user.model.js";
import { deleteOne, createOne, getOne, getAll } from "./handler-factory.js";
import ApiError from "../utils/api-error.js";

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

export const updateUser = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      role: req.body.role,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(new ApiError(`User Not Found for This id ${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    msg: `User Updated Successfully`,
    data: user,
  });
});

export const changeUserPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      newPassword: await bcrypt.hash(req.body.newPassword, 12),
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(new ApiError(`User Not Found for This id ${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    msg: `User Updated Successfully`,
    data: user,
  });
});

export const deleteUser = deleteOne(UserModel, "User");

export const deactivateUser = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      isActive: false,
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(new ApiError(`User Not Found for This id ${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    msg: `User Deactivated Successfully`,
    data: user,
  });
});

export const getAllUsers = getAll(UserModel, "User");

export const getSpecificUser = getOne(UserModel, "User");

// export const deactivateUser = deactivateOne(UserModel, "User");
