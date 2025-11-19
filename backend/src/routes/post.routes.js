import express from 'express';
import { createPost } from '../controllers/post.controller.js';
import {
  createPostValidationRules,
  validateRequest,
} from '../validators/post.validators.js';

const router = express.Router();

router.post(
  '/posts',
  createPostValidationRules,
  validateRequest,
  createPost
);

export default router;
