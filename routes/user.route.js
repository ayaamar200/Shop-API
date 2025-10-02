import { Router } from "express";

import {
  getAllUsers,
  getSpecificUser,
  createUser,
  updateUser,
  deleteUser,
  deactivateUser,
  changeUserPassword,
  uploadUserImage,
  imageProcessing,
} from "../services/user.service.js";
import {
  createUserValidator,
  deleteUserValidator,
  getSpecificUserValidator,
  updateUserValidator,
  changeUserPasswordValidator,
  deactivateUserValidator,
} from "../utils/validators/user.validator.js";
const router = Router();

router.put("/changPassword/:id",changeUserPasswordValidator, changeUserPassword);
router.patch("/deactivate/:id", deactivateUserValidator,deactivateUser);
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
