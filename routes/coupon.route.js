import { Router } from "express";
import {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCoupon,
} from "../services/coupon.service.js";
import {
  createCouponValidator,
  getCouponValidator,
  updateCouponValidator,
  deleteCouponValidator,
} from "../utils/validators/coupon.validator.js";
import { allowRoles, protect } from "../services/auth.service.js";
const router = Router();

router.use(protect, allowRoles("admin"));

router.route("/").get(getAllCoupons).post(createCouponValidator, createCoupon);
router
  .route("/:id")
  .get(getCouponValidator, getCoupon)
  .put(updateCouponValidator, updateCoupon)
  .delete(deleteCouponValidator, deleteCoupon);

export default router;
