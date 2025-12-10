import express from "express";
import multer from "multer";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  checkUserLike,
  getComments,
  createComment,
} from "../controllers/post.controller.js";
import {
  createPostValidationRules,
  updatePostValidationRules,
  validateRequest,
} from "../validators/post.validators.js";
import protectAdmin from "../middlewares/protectAdmin.js";
import protectUser from "../middlewares/protectUser.js";
import optionalAuth from "../middlewares/optionalAuth.js";

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

// Like/Unlike post - ต้อง login
router.post("/:postId/like", protectUser, toggleLike);

// Check user like status - optional auth (ถ้าไม่มี token จะ return hasLiked: false)
router.get("/:postId/like/status", optionalAuth, checkUserLike);

// Get comments - public (ไม่ต้อง login)
router.get("/:postId/comments", getComments);

// Create comment - ต้อง login
router.post("/:postId/comments", protectUser, createComment);

export default router;
