import crypto from "crypto";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

import ApiError from "../utils/api-error.js";
import UserModel from "../models/user.model.js";
import sendEmail from "../utils/send-email.js";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generate-token.js";
import CartModel from "../models/cart.model.js";

export const signup = asyncHandler(async (req, res, next) => {
  // 1- create user
  const user = await UserModel.create({
    username: req.body.username,
    slug: req.body.slug,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
  });

  // 2- If there is a guest cart, attach it to this new user
  if (req.guestId) {
    await CartModel.updateMany(
      { guestId: req.guestId },
      { $set: { user: user._id }, $unset: { guestId: "" } }
    );
  }
  // 3- generate Token
  const token = generateToken({
    id: user._id,
    username: user.username,
    role: user.role,
  });
  // 3- send response
  res.status(201).json({
    status: "success",
    msg: "Account Created Successfully",
    data: user,
    token,
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // 1- Check if user exists
  const user = await UserModel.findOne({ email });
  if (!user) {
    return next(new ApiError("Incorrect email or password", 401));
  }

  // 2- Check password AFTER confirming the user exists
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return next(new ApiError("Incorrect email or password", 401));
  }

  // 3- Activate account if deactivated
  if (!user.isActive) {
    user.isActive = true;
    await user.save();
  }

  // 4- If there is a guest cart, attach it to this user so they can see it when logged in
  if (req.guestId) {
    await CartModel.updateMany(
      { guestId: req.guestId },
      { $set: { user: user._id }, $unset: { guestId: "" } }
    );
  }

  // 5- Generate Token
  const token = generateToken({
    id: user._id,
    username: user.username,
    role: user.role,
  });

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

// Make sure that user is logged in
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
    return next(new ApiError("Access denied! Please log in first.", 401));
  }

  // 2- verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch {
    return next(new ApiError("Invalid or expired token", 401));
  }

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
        new ApiError("User recently changed password! Please login again.", 401)
      );
    }
  }

  if (!currentUser.isActive) {
    return next(
      new ApiError(
        "Your account has been deactivated. You can reactivate it anytime by logging back in.",
        403
      )
    );
  }

  req.user = currentUser;

  next();
});

// Attach user to request if a valid JWT exists, but do not require authentication
export const attachUserIfAuthenticated = asyncHandler(
  async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const currentUser = await UserModel.findById(decoded.userData.id);

      if (!currentUser || !currentUser.isActive) {
        return next();
      }

      req.user = currentUser;
    } catch {
      // If token is invalid/expired we just continue as a guest
      
    }

    next();
  }
);

// User Permissions
export const allowRoles = (...roles) =>
  asyncHandler(async (req, res, next) => {
    //  1- check if user role is allowed
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You do not have permission to perform this action", 403)
      );
    }
    next();
  });

export const forgotPassword = asyncHandler(async (req, res, next) => {
  // 1- get user based on POSTed email
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ApiError(`There is no user with email address ${req.body.email}`, 404)
    );
  }

  // 2- generate reset code random 6-digit
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  // Hash the reset code before saving (for security)
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // save hashed password reset code into Database
  user.passwordResetCode = hashedResetCode;
  // set password reset code expire time  10 minutes
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  await user.save();

  // 3- send reset code to user via email
  const message = `Hi ${user.username},\n We received a request to reset the password on your Electro El-Hany Shop account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The Electro El-Hany Team`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your Password Reset Code (Valid for 10 minutes)",
      message: message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();

    return next(new ApiError(err.message, 500));
  }

  // 4- send response
  res.status(200).json({
    status: "success",
    msg: "Password reset code sent to email successfully",
  });
});

export const verifyResetCode = asyncHandler(async (req, res, next) => {
  // 1- get user based on rest code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await UserModel.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Reset code is invalid or has expired", 400));
  }

  // 2- set password reset verified to true
  user.passwordResetVerified = true;
  await user.save();

  // 3- send response
  res.status(200).json({
    status: "success",
    msg: "Reset code verified successfully",
  });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  // 1- get user based on email
  const user = await UserModel.findOne({
    email: req.body.email,
  });

  if (!user) {
    return next(
      new ApiError(`There is no user with email address ${req.body.email}`, 404)
    );
  }

  // 2- check if password reset code is verified
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code is not verified", 400));
  }

  // 3- update password
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;
  await user.save();

  // 4- generate Token
  const token = generateToken({
    id: user._id,
    username: user.username,
    role: user.role,
  });

  // 4- send response
  res.status(200).json({
    status: "success",
    msg: "Password reset successfully",
    token,
  });
});
