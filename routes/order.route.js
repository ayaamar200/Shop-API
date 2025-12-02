import { Router } from "express";
import {
  checkoutSession,
  createCashOrder,
  filterOrders,
  getAllOrders,
  getOrder,
  updateOrderToDelivered,
  updateOrderToPaid,
} from "../services/order.service.js";

import { allowRoles, protect } from "../services/auth.service.js";

const router = Router();

router.get("/checkout-session/:cartId", checkoutSession);

router.route("/").get(filterOrders, getAllOrders);
router
  .route("/admin")
  .get(protect, allowRoles("admin"), filterOrders, getAllOrders);

router.route("/:id/pay").put(protect, allowRoles("admin"), updateOrderToPaid);
router
  .route("/:id/delivered")
  .put(protect, allowRoles("admin"), updateOrderToDelivered);

router.route("/:id").get(getOrder);

router.route("/:cartId").post(createCashOrder);
export default router;
