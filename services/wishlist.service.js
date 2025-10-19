import asyncHandler from "express-async-handler";
import UserModel from "../models/user.model.js";

export const addProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Product added to your wishlist successfully.",
    data: user.wishlist,
  });
});

export const removeProductFromWishlist = asyncHandler(
  async (req, res, next) => {
    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { wishlist: req.params.productId },
      },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "Product removed from your wishlist successfully.",
      data: user.wishlist,
    });
  }
);

export const getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id).populate("wishlist");

  res.status(200).json({
    status: "success",
    results: user.wishlist.length,
    data: user.wishlist,
  });
});
