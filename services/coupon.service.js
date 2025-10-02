import CouponModel from "../models/coupon.model.js";
import { deleteOne, updateOne, createOne, getOne, getAll } from "./handler-factory.js";

export const createCoupon = createOne(CouponModel, "Coupon");

export const updateCoupon = updateOne(CouponModel, "Coupon");

export const deleteCoupon = deleteOne(CouponModel, "Coupon");

export const getAllCoupons = getAll(CouponModel, "Coupon");

export const getCoupon = getOne(CouponModel, "Coupon");
