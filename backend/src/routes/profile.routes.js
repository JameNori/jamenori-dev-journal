import express from "express";
import multer from "multer";
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

const router = express.Router();

// ตั้งค่า Multer สำหรับการอัปโหลดไฟล์ (เก็บใน memory)
const multerUpload = multer({ storage: multer.memoryStorage() });

// กำหนดฟิลด์ที่จะรับไฟล์ (สามารถรับได้หลายฟิลด์)
const imageFileUpload = multerUpload.fields([
  { name: "imageFile", maxCount: 1 },
]);

// Get admin profile (public, ไม่ต้องมี token)
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
  handleUpdateProfile
);

export default router;
