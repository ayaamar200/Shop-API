import { Router } from "express";

import { allowRoles, protect } from "../services/auth.service.js";
import {
  addAddress,
  getLoggedUserAddresses,
  removeAddress,
} from "../services/address.service.js";
import {
  addAddressValidator,
  removeAddressValidator,
} from "../utils/validators/address.validator.js";

const router = Router();

router.use(protect, allowRoles("user"));

router
  .route("/")
  .post(addAddressValidator, addAddress)
  .get(getLoggedUserAddresses);

router.delete("/:addressId", removeAddressValidator, removeAddress);

export default router;
