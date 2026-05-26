import express from "express";
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
import { imageFileUpload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post(
  "/",
  protectAdmin,
  imageFileUpload,
  createPostValidationRules,
  validateRequest,
  createPost,
);

router.get("/", getAllPosts);

router.get("/:postId", getPostById);

router.put(
  "/:postId",
  protectAdmin,
  imageFileUpload,
  updatePostValidationRules,
  validateRequest,
  updatePost,
);

router.delete("/:postId", protectAdmin, deletePost);

router.post("/:postId/like", protectUser, toggleLike);

router.get("/:postId/like/status", optionalAuth, checkUserLike);

router.get("/:postId/comments", getComments);

router.post("/:postId/comments", protectUser, createComment);

export default router;
