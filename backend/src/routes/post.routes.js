import express from "express";
import multer from "multer";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";
import {
  createPostValidationRules,
  updatePostValidationRules,
  validateRequest,
} from "../validators/post.validators.js";
import protectAdmin from "../middlewares/protectAdmin.js";

const router = express.Router();

// ตั้งค่า Multer สำหรับการอัปโหลดไฟล์ (เก็บใน memory)
const multerUpload = multer({ storage: multer.memoryStorage() });

// กำหนดฟิลด์ที่จะรับไฟล์ (สามารถรับได้หลายฟิลด์)
const imageFileUpload = multerUpload.fields([
  { name: "imageFile", maxCount: 1 },
]);

// Create - เพิ่ม multer middleware และ protectAdmin
router.post(
  "/",
  imageFileUpload,
  protectAdmin,
  createPostValidationRules,
  validateRequest,
  createPost
);

// Get all (pagination + filter + search)
router.get("/", getAllPosts);

// Get one post
router.get("/:postId", getPostById);

// Update post - เพิ่ม multer middleware และ protectAdmin
router.put(
  "/:postId",
  imageFileUpload,
  protectAdmin,
  updatePostValidationRules,
  validateRequest,
  updatePost
);

// Delete post - เพิ่ม protectAdmin
router.delete("/:postId", protectAdmin, deletePost);

export default router;
