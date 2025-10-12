import asyncHandler from "express-async-handler";
import sharp from "sharp";
import bcrypt from "bcrypt";

import { uploadSingleFile } from "../middlewares/upload-file.middleware.js";
import UserModel from "../models/user.model.js";
import { deleteOne, createOne, getOne, getAll } from "./handler-factory.js";
import ApiError from "../utils/api-error.js";
import generateToken from "../utils/generate-token.js";

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
      username: req.body.username,
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
      password: await bcrypt.hash(req.body.newPassword, 12),
      passwordChangedAt: Date.now(),
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
    msg: `User Password Updated Successfully`,
    data: user,
  });
});

export const deleteUser = deleteOne(UserModel, "User");

export const getAllUsers = getAll(UserModel, "User");

export const getSpecificUser = getOne(UserModel, "User");

// Get Logged User Data
export const getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// Update Logged User Password
export const updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.newPassword, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  // Generate Token
  const token = generateToken({
    id: user._id,
    username: user.username,
    role: user.role,
  });
  res.status(200).json({
    status: "success",
    msg: `User Password Updated Successfully`,
    data: user,
    token,
  });
});

// Update Logged User Data
export const updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    msg: `User Data Updated Successfully`,
    data: user,
  });
});

// Deactivate Logged User
export const deactivateLoggedUser = asyncHandler(async (req, res, next) => {
  await UserModel.findByIdAndUpdate(req.user._id, {
    isActive: false,
  });
  res.status(200).json({
    status: "success",
    msg: `Account Deactivated Successfully`,
  });
});

// Reactivate User
// export const reactivateLoggedUser = asyncHandler(async (req, res, next) => {
//   await UserModel.findByIdAndUpdate(
//     req.user._id,
//     {
//       isActive: true,
//     }
//   );
//   res.status(200).json({
//     status: "success",
//     msg: `Account Activated Successfully`,
//   });
// });
