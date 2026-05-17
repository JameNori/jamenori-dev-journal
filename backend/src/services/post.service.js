import * as postRepo from "../repositories/post.repository.js";
import * as notificationService from "./notification.service.js";

/**
 * สร้างโพสต์ใหม่ในตาราง posts (data access)
 */
export async function createPost(data) {
  return postRepo.insert(data);
}

/**
 * สร้าง article (use-case): insert post + notify users เมื่อ admin สร้างบทความใหม่
 * ใช้กับ endpoint: POST /posts
 */
export async function createArticle(data) {
  const postResult = await createPost(data);

  if (postResult?.id && data.user_id) {
    try {
      await notificationService.createNewArticleNotification(
        postResult.id,
        data.user_id,
      );
    } catch (error) {
      // Log แต่ไม่ให้ส่งผลต่อ response — notification เป็น side effect
      console.error("Error creating new article notification:", error);
    }
  }

  return postResult;
}

/**
 * ดึงรายการโพสต์ทั้งหมดแบบมี pagination + filter + keyword search
 * ใช้กับ endpoint: GET /posts
 * รองรับ query:
 * - page    (default 1)
 * - limit   (default 6)
 * - category (optional, ใช้ category_id)
 * - keyword (optional, ค้นหา title/description/content)
 *
 * Response:
 * - category เป็นชื่อหมวดหมู่ (เช่น "Learning & Mindset")
 * - category_id เป็น ID ของหมวดหมู่ (สำหรับ frontend ที่ต้องการ map ข้อมูล)
 * สอดคล้องกับ getPostById() ที่ส่ง category name เช่นกัน
 */
export async function getAllPosts({ page = 1, limit = 6, category, keyword }) {
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 6;
  const offset = (pageNumber - 1) * limitNumber;

  const { total: totalPosts, posts } = await postRepo.findPage({
    category,
    keyword,
    limit: limitNumber,
    offset,
  });

  const totalPages = Math.ceil(totalPosts / limitNumber) || 1;

  return {
    totalPosts,
    totalPages,
    currentPage: pageNumber,
    limit: limitNumber,
    nextPage: pageNumber < totalPages ? pageNumber + 1 : null,
    posts,
  };
}

/**
 * ดึงโพสต์ตาม id หนึ่งตัว
 * ใช้กับ endpoint: GET /posts/:postId
 * Requirement :
 * - category เป็นชื่อหมวดหมู่ (เช่น "Cat")
 * - status เป็น string ("draft" / "publish")
 */
export async function getPostById(postId) {
  const id = Number(postId);
  const row = await postRepo.findById(id);

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    image: row.image,
    category: row.category,
    title: row.title,
    description: row.description,
    date: row.date,
    content: row.content,
    status: row.status,
    likes_count: row.likes_count,
  };
}

/**
 * แก้ไขโพสต์เดิม
 * ใช้กับ endpoint: PUT /posts/:postId
 */
export async function updatePost(postId, data) {
  const id = Number(postId);
  return postRepo.update(id, data);
}

/**
 * ลบโพสต์
 * ใช้กับ endpoint: DELETE /posts/:postId
 */
export async function deletePost(postId) {
  const id = Number(postId);
  return postRepo.deleteById(id);
}

/**
 * Toggle like/unlike post
 * ใช้กับ endpoint: POST /posts/:postId/like
 * ถ้ามี like อยู่แล้วจะ unlike, ถ้ายังไม่มีจะ like
 */
export async function toggleLike(postId, userId) {
  const postIdNum = Number(postId);
  return postRepo.toggleLike(postIdNum, userId);
}

/**
 * Like/Unlike post + สร้าง notification เมื่อ like (use-case)
 * ใช้กับ endpoint: POST /posts/:postId/like
 * Return: null ถ้าไม่เจอ post, otherwise { likes_count, hasLiked }
 */
export async function likePost(postId, userId) {
  const post = await getPostById(postId);
  if (!post) return null;

  const result = await toggleLike(postId, userId);

  if (result.hasLiked) {
    try {
      await notificationService.createLikeNotification(postId, userId);
    } catch (error) {
      // notification เป็น side effect — ไม่ fail request
      console.error("Error creating like notification:", error);
    }
  }

  return result;
}

/**
 * เช็คสถานะ like ของ user สำหรับ post
 * ใช้กับ endpoint: GET /posts/:postId/like/status
 */
export async function checkUserLike(postId, userId) {
  const postIdNum = Number(postId);
  const hasLiked = await postRepo.existsLike(postIdNum, userId);
  return { hasLiked };
}

/**
 * ดึง comments ทั้งหมดของ post
 * ใช้กับ endpoint: GET /posts/:postId/comments
 */
export async function getComments(postId) {
  const postIdNum = Number(postId);
  const comments = await postRepo.findCommentsByPostId(postIdNum);

  return comments.map((comment) => ({
    id: comment.id,
    comment_id: comment.id, // สำหรับ backward compatibility
    content: comment.comment_text, // Map comment_text to content for frontend
    created_at: comment.created_at,
    user: {
      id: comment.user_id,
      name: comment.name || "Anonymous",
      profilePic: comment.profile_pic || null,
    },
  }));
}

/**
 * สร้าง comment ใหม่
 * ใช้กับ endpoint: POST /posts/:postId/comments
 */
export async function createComment(postId, userId, content) {
  const postIdNum = Number(postId);

  const newComment = await postRepo.insertComment(
    postIdNum,
    userId,
    content,
  );

  if (!newComment) {
    return null;
  }

  const profile = await postRepo.findUserNameAndProfilePic(userId);

  return {
    id: newComment.id,
    comment_id: newComment.id, // สำหรับ backward compatibility
    content: newComment.comment_text, // Map comment_text to content for frontend
    created_at: newComment.created_at,
    user: {
      id: newComment.user_id,
      name: profile?.name || "Anonymous",
      profilePic: profile?.profile_pic || null,
    },
  };
}

/**
 * สร้าง comment + notification flow (use-case)
 * ใช้กับ endpoint: POST /posts/:postId/comments
 * Return: null ถ้าไม่เจอ post, otherwise comment object
 */
export async function addComment(postId, userId, content) {
  const post = await getPostById(postId);
  if (!post) return null;

  const comment = await createComment(postId, userId, content);
  if (!comment) {
    throw new Error("Failed to create comment");
  }

  try {
    await notificationService.createCommentNotification(
      postId,
      userId,
      comment.id,
    );
    await notificationService.createCommentReplyNotification(
      postId,
      userId,
      comment.id,
    );
  } catch (error) {
    // notification เป็น side effect — ไม่ fail request
    console.error("Error creating comment notification:", error);
  }

  return comment;
}
