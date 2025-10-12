import { Router } from "express";

import {
  getAllUsers,
  getSpecificUser,
  createUser,
  updateUser,
  deleteUser,
  changeUserPassword,
  uploadUserImage,
  imageProcessing,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deactivateLoggedUser,
} from "../services/user.service.js";
import {
  createUserValidator,
  deleteUserValidator,
  getSpecificUserValidator,
  updateUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserPasswordValidator,
  updateLoggedUserDataValidator,
} from "../utils/validators/user.validator.js";
import { allowRoles, protect } from "../services/auth.service.js";
const router = Router();

router.use(protect);
router.route("/getMyData").get(getLoggedUserData, getSpecificUser);
router
  .route("/changeMyPassword")
  .put(updateLoggedUserPasswordValidator, updateLoggedUserPassword);
router
  .route("/updateMyData")
  .put(
    uploadUserImage,
    imageProcessing,
    updateLoggedUserDataValidator,
    updateLoggedUserData
  );

router.route("/deactivateMe").delete(deactivateLoggedUser);
// router.route("/activateMe").put(reactivateLoggedUser);

router.use(allowRoles("admin"));
router.put(
  "/changPassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);
router
  .route("/")
  .get(getAllUsers)
  .post(uploadUserImage, imageProcessing, createUserValidator, createUser);

router
  .route("/:id")
  .get(getSpecificUserValidator, getSpecificUser)
  .put(uploadUserImage, imageProcessing, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

export default router;
