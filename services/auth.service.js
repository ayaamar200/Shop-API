import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import ApiError from "../utils/api-error.js";
import UserModel from "../models/user.model.js";

const generateToken = (payload) => {
  return jwt.sign({ userData: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

export const signup = asyncHandler(async (req, res, next) => {
  // 1- create user
  const user = await UserModel.create({
    username: req.body.username,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
  });
  // 2- generate Token
  const token = generateToken({
    id: user._id,
    username: user.username,
    role: user.role,
  });
  // 3- send response
  res.status(201).json({
    status: "success",
    msg: "User Created Successfully",
    data: user,
    token,
  });
});

export const login = asyncHandler(async (req, res, next) => {
  // 1- check if user exists &  password is correct
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!user || !isPasswordCorrect) {
    return next(new ApiError("Incorrect email or password", 401));
  }

  // if (!isPasswordCorrect) {
  //   return next(new ApiError("Incorrect email or password", 401));
  // }

  // 3- generate Token
  const token = generateToken({
    id: user._id,
    username: user.username,
    role: user.role,
  });
  // 4- send response
  res.status(200).json({
    status: "success",
    msg: "User Logged In Successfully",
    data: {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    token,
  });
});

export const protect = asyncHandler(async (req, res, next) => {
  // 1- get token & check if it's valid
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ApiError(
        "You are not authorized to access this route! Please login first",
        401
      )
    );
  }

  // 2- verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3- check if user still exists
  const currentUser = await UserModel.findById(decoded.userData.id);
  if (!currentUser) {
    return next(
      new ApiError("The user belonging to this token does no longer exist", 401)
    );
  }

  // 4- check if user changed password after token was issued
  if (currentUser.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );

    if (passwordChangedTimestamp > decoded.iat) {
      return next(
        new ApiError("User recently changed password! Please login again", 401)
      );
    }
  }

  req.user = currentUser;

  next();
});
