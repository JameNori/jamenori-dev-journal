import * as postService from "../services/post.service.js";
import * as notificationService from "../services/notification.service.js";
import {
  uploadImage,
  ImageUploadError,
} from "../services/imageUpload.service.js";

/**
 * CREATE
 * Endpoint: POST /posts
 * Success: 201 + { message: "Created post successfully" }
 * Fail:
 *  - 400 ถ้าข้อมูลจาก client ไม่ครบ หรือไฟล์ไม่ถูกต้อง
 *  - 500 ถ้า error จาก database หรือ Supabase Storage
 */
export const createPost = async (req, res) => {
  try {
    const { title, image, category_id, description, content, status_id } =
      req.body;

    // เช็ก required fields (ยกเว้น image เพราะอาจจะส่ง imageFile แทน)
    if (!title || !category_id || !description || !content || !status_id) {
      return res.status(400).json({
        message:
          "Server could not create post because there are missing data from client",
      });
    }

    let imageUrl = image;

    if (req.files?.imageFile?.[0]) {
      imageUrl = await uploadImage(req.files.imageFile[0], "posts");
    }

    // ถ้าไม่มี imageFile และไม่มี image URL → error
    if (!imageUrl) {
      return res.status(400).json({
        message:
          "Image is required. Please upload an image file or provide image URL.",
      });
    }

    // บันทึกข้อมูลโพสต์ลงในฐานข้อมูล
    const userId = req.user?.id;

    const postResult = await postService.createPost({
      title,
      image: imageUrl,
      category_id,
      description,
      content,
      status_id,
      user_id: userId,
    });

    // สร้าง notification ให้ทุก user เมื่อ admin สร้าง article ใหม่
    if (postResult?.id && userId) {
      try {
        await notificationService.createNewArticleNotification(
          postResult.id,
          userId
        );
      } catch (error) {
        // Log error แต่ไม่ให้ส่งผลต่อ response
        console.error("Error creating new article notification:", error);
      }
    }

    return res.status(201).json({
      message: "Created post successfully",
    });
  } catch (err) {
    if (err instanceof ImageUploadError) {
      return res.status(err.statusCode).json({ message: err.message });
    }

    console.error("Error creating post:", err);

    return res.status(500).json({
      message: "Server could not create post because database connection",
      error: err.message,
    });
  }
};

/**
 * READ (All)
 * Endpoint: GET /posts
 * รองรับ query: page, limit, category, keyword
 */
export const getAllPosts = async (req, res) => {
  try {
    const { page, limit, category, keyword } = req.query;

    const data = await postService.getAllPosts({
      page,
      limit,
      category,
      keyword,
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error reading posts:", error);

    return res.status(500).json({
      message: "Server could not read post because database connection",
    });
  }
};

/**
 * READ (One)
 * Endpoint: GET /posts/:postId
 * Success: คืน object ของ post
 * 404: ถ้าไม่เจอ post
 */
export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await postService.getPostById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Server could not find a requested post",
      });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error("Error reading post:", error);

    return res.status(500).json({
      message: "Server could not read post because database connection",
    });
  }
};

/**
 * UPDATE
 * Endpoint: PUT /posts/:postId
 * Success: 200 + { message: "Updated post successfully" }
 * 404: ถ้าไม่เจอ post ให้แก้ไข
 * 400: ถ้าไฟล์ไม่ถูกต้อง
 * 500: ถ้า error จาก database หรือ Supabase Storage
 */
export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, image, category_id, description, content, status_id } =
      req.body;

    // เช็ก required fields (ยกเว้น image เพราะอาจจะส่ง imageFile แทน)
    if (!title || !category_id || !description || !content || !status_id) {
      return res.status(400).json({
        message:
          "Server could not update post because there are missing data from client",
      });
    }

    let imageUrl = image;

    if (req.files?.imageFile?.[0]) {
      imageUrl = await uploadImage(req.files.imageFile[0], "posts");
    }

    // ถ้าไม่มี imageFile และไม่มี image URL → error
    if (!imageUrl) {
      return res.status(400).json({
        message:
          "Image is required. Please upload an image file or provide image URL.",
      });
    }

    // อัปเดตข้อมูลโพสต์ในฐานข้อมูล
    const updated = await postService.updatePost(postId, {
      title,
      image: imageUrl,
      category_id,
      description,
      content,
      status_id,
    });

    if (!updated) {
      return res.status(404).json({
        message: "Server could not find a requested post to update",
      });
    }

    return res.status(200).json({
      message: "Updated post successfully",
    });
  } catch (error) {
    if (error instanceof ImageUploadError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.error("Error updating post:", error);

    return res.status(500).json({
      message: "Server could not update post because database connection",
      error: error.message,
    });
  }
};

/**
 * DELETE
 * Endpoint: DELETE /posts/:postId
 * Success: 200 + { message: "Deleted post successfully" }
 * 404: ถ้าไม่เจอ post ให้ลบ
 */
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const deleted = await postService.deletePost(postId);

    if (!deleted) {
      return res.status(404).json({
        message: "Server could not find a requested post to delete",
      });
    }

    return res.status(200).json({
      message: "Deleted post successfully",
    });
  } catch (error) {
    console.error("Error deleting post:", error);

    return res.status(500).json({
      message: "Server could not delete post because database connection",
    });
  }
};

/**
 * Toggle Like/Unlike
 * Endpoint: POST /posts/:postId/like
 * Success: 200 + { likes_count, hasLiked }
 * 401: ถ้าไม่มี token
 * 404: ถ้าไม่เจอ post
 */
export const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized: User authentication required",
      });
    }

    // เช็คว่ามี post นี้หรือไม่
    const post = await postService.getPostById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Server could not find a requested post",
      });
    }

    const result = await postService.toggleLike(postId, userId);

    // สร้าง notification เมื่อ like (ไม่ใช่ unlike)
    if (result.hasLiked) {
      try {
        await notificationService.createLikeNotification(postId, userId);
      } catch (error) {
        // Log error แต่ไม่ให้ส่งผลต่อ response
        console.error("Error creating like notification:", error);
      }
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error toggling like:", error);

    return res.status(500).json({
      message: "Server could not toggle like because database connection",
    });
  }
};

/**
 * Check User Like Status
 * Endpoint: GET /posts/:postId/like/status
 * Success: 200 + { hasLiked }
 * 401: ถ้าไม่มี token (optional - ถ้าไม่มี token จะ return hasLiked: false)
 */
export const checkUserLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(200).json({
        hasLiked: false,
      });
    }

    const result = await postService.checkUserLike(postId, userId);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error checking like status:", error);

    return res.status(500).json({
      message: "Server could not check like status because database connection",
    });
  }
};

/**
 * Get Comments
 * Endpoint: GET /posts/:postId/comments
 * Success: 200 + { comments: [...] }
 * 404: ถ้าไม่เจอ post
 */
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    // เช็คว่ามี post นี้หรือไม่
    const post = await postService.getPostById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Server could not find a requested post",
      });
    }

    const comments = await postService.getComments(postId);

    return res.status(200).json({
      comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);

    return res.status(500).json({
      message: "Server could not fetch comments because database connection",
    });
  }
};

/**
 * Create Comment
 * Endpoint: POST /posts/:postId/comments
 * Success: 201 + comment object
 * 400: ถ้าข้อมูลไม่ครบ
 * 401: ถ้าไม่มี token
 * 404: ถ้าไม่เจอ post
 */
export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized: User authentication required",
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Server could not create comment because content is required",
      });
    }

    // เช็คว่ามี post นี้หรือไม่
    const post = await postService.getPostById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Server could not find a requested post",
      });
    }

    const comment = await postService.createComment(
      postId,
      userId,
      content.trim()
    );

    if (!comment) {
      return res.status(500).json({
        message: "Server could not create comment",
      });
    }

    // สร้าง notification สำหรับ comment
    try {
      // ส่ง notification ให้ author ของ post
      await notificationService.createCommentNotification(
        postId,
        userId,
        comment.id
      );

      // ส่ง notification ให้ทุก user ที่เคย comment บน post นี้
      await notificationService.createCommentReplyNotification(
        postId,
        userId,
        comment.id
      );
    } catch (error) {
      // Log error แต่ไม่ให้ส่งผลต่อ response
      console.error("Error creating comment notification:", error);
    }

    return res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);

    return res.status(500).json({
      message: "Server could not create comment because database connection",
    });
  }
};
