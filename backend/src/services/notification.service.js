import * as notificationRepo from "../repositories/notification.repository.js";

/**
 * สร้าง notification เมื่อ user like post (skip ถ้า liker เป็นเจ้าของ post)
 */
export async function createLikeNotification(postId, userId) {
  const post = await notificationRepo.findPostById(Number(postId));

  if (!post || !post.user_id) return null;
  if (post.user_id === userId) return null;

  return notificationRepo.insert({
    recipientId: post.user_id,
    postId: post.id,
    type: "like",
    actorUserId: userId,
  });
}

/**
 * สร้าง notification เมื่อ user comment post (skip ถ้า commenter เป็นเจ้าของ post)
 */
export async function createCommentNotification(postId, userId, commentId) {
  const post = await notificationRepo.findPostById(Number(postId));

  if (!post || !post.user_id) return null;
  if (post.user_id === userId) return null;

  return notificationRepo.insert({
    recipientId: post.user_id,
    postId: post.id,
    type: "comment",
    actorUserId: userId,
    commentId: Number(commentId),
  });
}

/**
 * Broadcast notification ให้ทุก user ยกเว้น admin ที่สร้าง post
 * คืนจำนวน notifications ที่สร้างสำเร็จ
 */
export async function createNewArticleNotification(postId, adminId) {
  const postIdNum = Number(postId);

  const post = await notificationRepo.findPostById(postIdNum);
  if (!post) return 0;

  const recipients = await notificationRepo.findUserIdsExcept(adminId);
  if (recipients.length === 0) return 0;

  let insertedCount = 0;
  for (const recipient of recipients) {
    try {
      await notificationRepo.insert({
        recipientId: recipient.id,
        postId: postIdNum,
        type: "new_article",
        actorUserId: adminId,
      });
      insertedCount++;
    } catch (error) {
      // Resilient fan-out: row นึง fail ไม่ block ที่เหลือ
      console.error(
        `Error inserting new_article notification for user ${recipient.id}:`,
        error
      );
    }
  }

  return insertedCount;
}

/**
 * Broadcast notification ให้ user ที่เคย comment บน post นี้ (ยกเว้นคน comment ปัจจุบัน)
 * คืนจำนวน notifications ที่สร้างสำเร็จ
 */
export async function createCommentReplyNotification(postId, userId, commentId) {
  const postIdNum = Number(postId);
  const commentIdNum = Number(commentId);

  const recipients = await notificationRepo.findDistinctCommenterUserIds(
    postIdNum,
    userId
  );
  if (recipients.length === 0) return 0;

  let insertedCount = 0;
  for (const recipient of recipients) {
    try {
      await notificationRepo.insert({
        recipientId: recipient.user_id,
        postId: postIdNum,
        type: "comment_reply",
        actorUserId: userId,
        commentId: commentIdNum,
      });
      insertedCount++;
    } catch (error) {
      // Resilient fan-out: row นึง fail ไม่ block ที่เหลือ
      console.error(
        `Error inserting comment_reply notification for user ${recipient.user_id}:`,
        error
      );
    }
  }

  return insertedCount;
}

/**
 * ดึง notifications ของ user พร้อม pagination + format ให้ frontend ใช้
 */
export async function getNotifications(userId, page = 1, limit = 10) {
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const offset = (pageNumber - 1) * limitNumber;

  const total = await notificationRepo.countByUserId(userId);
  const totalPages = Math.ceil(total / limitNumber) || 1;

  const rows = await notificationRepo.findByUserIdWithPagination(userId, {
    limit: limitNumber,
    offset,
  });

  const notifications = rows.map((row) => ({
    id: row.id,
    type: row.type,
    is_read: row.is_read,
    created_at: row.created_at,
    post: {
      id: row.post_id,
      title: row.post_title,
    },
    actor: row.actor_id
      ? {
          id: row.actor_id,
          name: row.actor_name || "Anonymous",
          profilePic: row.actor_profile_pic || null,
        }
      : null,
    comment: row.comment_content ? row.comment_content : null,
  }));

  return {
    notifications,
    total,
    totalPages,
    currentPage: pageNumber,
    limit: limitNumber,
    nextPage: pageNumber < totalPages ? pageNumber + 1 : null,
  };
}

export async function getUnreadCount(userId) {
  return notificationRepo.countUnreadByUserId(userId);
}

export async function markAsRead(notificationId, userId) {
  return notificationRepo.markAsRead(Number(notificationId), userId);
}
