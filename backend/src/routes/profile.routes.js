import express from "express";
import {
  handleGetProfile,
  handleUpdateProfile,
  handleGetAdminProfile,
} from "../controllers/profile.controller.js";
import {
  updateProfileValidationRules,
  validateRequest,
} from "../validators/profile.validators.js";
import protectUser from "../middlewares/protectUser.js";
import { imageFileUpload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/admin", handleGetAdminProfile);

// Get profile - ต้องมี protectUser
router.get("/", protectUser, handleGetProfile);

// Update profile - ต้องมี protectUser, multer, และ validation
router.put(
  "/",
  imageFileUpload,
  protectUser,
  updateProfileValidationRules,
  validateRequest,
  handleUpdateProfile,
);

export default router;
