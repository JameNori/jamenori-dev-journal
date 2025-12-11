import sql from "../db/db.js";

/**
 * สร้าง notification เมื่อ user like post
 * @param {string} postId - ID ของ post ที่ถูก like
 * @param {string} userId - ID ของ user ที่ like (actor)
 * @returns {Promise<Object|null>} - Notification object หรือ null
 */
export async function createLikeNotification(postId, userId) {
  const postIdNum = Number(postId);

  // ดึงข้อมูล post เพื่อหา author (user_id ของ post)
  const post = await sql`
    SELECT user_id, title FROM posts WHERE id = ${postIdNum} LIMIT 1
  `;

  if (post.length === 0 || !post[0].user_id) {
    // ถ้าไม่มี post หรือไม่มี user_id (author) ไม่ต้องสร้าง notification
    return null;
  }

  const authorId = post[0].user_id;

  // ถ้า user ที่ like เป็นคนเดียวกับ author ไม่ต้องสร้าง notification
  if (authorId === userId) {
    return null;
  }

  // สร้าง notification (user_id = author ที่จะได้รับ notification, actor_user_id = user ที่ like)
  const result = await sql`
    INSERT INTO notifications (user_id, post_id, type, actor_user_id)
    VALUES (${authorId}, ${postIdNum}, 'like', ${userId})
    RETURNING id, user_id, post_id, type, actor_user_id, is_read, created_at
  `;

  return result.length > 0 ? result[0] : null;
}

/**
 * สร้าง notification เมื่อ user comment post
 * @param {string} postId - ID ของ post ที่ถูก comment
 * @param {string} userId - ID ของ user ที่ comment
 * @param {number} commentId - ID ของ comment ที่สร้าง
 * @returns {Promise<Object|null>} - Notification object หรือ null
 */
export async function createCommentNotification(postId, userId, commentId) {
  const postIdNum = Number(postId);
  const commentIdNum = Number(commentId);

  // ดึงข้อมูล post เพื่อหา author (user_id ของ post)
  const post = await sql`
    SELECT user_id, title FROM posts WHERE id = ${postIdNum} LIMIT 1
  `;

  if (post.length === 0 || !post[0].user_id) {
    // ถ้าไม่มี post หรือไม่มี user_id (author) ไม่ต้องสร้าง notification
    return null;
  }

  const authorId = post[0].user_id;

  // ถ้า user ที่ comment เป็นคนเดียวกับ author ไม่ต้องสร้าง notification
  if (authorId === userId) {
    return null;
  }

  // สร้าง notification (user_id = author ที่จะได้รับ notification, actor_user_id = user ที่ comment)
  const result = await sql`
    INSERT INTO notifications (user_id, post_id, type, actor_user_id, comment_id)
    VALUES (${authorId}, ${postIdNum}, 'comment', ${userId}, ${commentIdNum})
    RETURNING id, user_id, post_id, type, actor_user_id, comment_id, is_read, created_at
  `;

  return result.length > 0 ? result[0] : null;
}

/**
 * ดึง notifications ของ user พร้อม pagination
 * @param {string} userId - ID ของ user
 * @param {number} page - หน้า (default: 1)
 * @param {number} limit - จำนวนต่อหน้า (default: 10)
 * @returns {Promise<Object>} - { notifications, total, totalPages, currentPage }
 */
export async function getNotifications(userId, page = 1, limit = 10) {
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const offset = (pageNumber - 1) * limitNumber;

  // นับจำนวน notifications ทั้งหมด
  const countResult = await sql`
    SELECT COUNT(*)::INT AS total
    FROM notifications
    WHERE user_id = ${userId}
  `;
  const total = countResult[0]?.total ?? 0;
  const totalPages = Math.ceil(total / limitNumber) || 1;

  // ดึง notifications พร้อมข้อมูลที่เกี่ยวข้อง
  const notifications = await sql`
    SELECT 
      n.id,
      n.type,
      n.is_read,
      n.created_at,
      n.comment_id,
      p.id AS post_id,
      p.title AS post_title,
      u.id AS actor_id,
      u.name AS actor_name,
      u.profile_pic AS actor_profile_pic,
      c.comment_text AS comment_content
    FROM notifications n
    INNER JOIN posts p ON n.post_id = p.id
    INNER JOIN users u ON n.actor_user_id = u.id
    LEFT JOIN comments c ON n.comment_id = c.id
    WHERE n.user_id = ${userId}
    ORDER BY n.created_at DESC
    LIMIT ${limitNumber} OFFSET ${offset}
  `;

  // Format notifications
  const formattedNotifications = notifications.map((notif) => ({
    id: notif.id,
    type: notif.type,
    is_read: notif.is_read,
    created_at: notif.created_at,
    post: {
      id: notif.post_id,
      title: notif.post_title,
    },
    actor: notif.actor_id
      ? {
          id: notif.actor_id,
          name: notif.actor_name || "Anonymous",
          profilePic: notif.actor_profile_pic || null,
        }
      : null,
    comment: notif.comment_content ? notif.comment_content : null,
  }));

  return {
    notifications: formattedNotifications,
    total,
    totalPages,
    currentPage: pageNumber,
    limit: limitNumber,
    nextPage: pageNumber < totalPages ? pageNumber + 1 : null,
  };
}

/**
 * นับจำนวน unread notifications ของ user
 * @param {string} userId - ID ของ user
 * @returns {Promise<number>} - จำนวน unread notifications
 */
export async function getUnreadCount(userId) {
  const result = await sql`
    SELECT COUNT(*)::INT AS count
    FROM notifications
    WHERE user_id = ${userId} AND is_read = FALSE
  `;

  return result[0]?.count ?? 0;
}

/**
 * Mark notification เป็น read
 * @param {number} notificationId - ID ของ notification
 * @param {string} userId - ID ของ user (เพื่อ verify ownership)
 * @returns {Promise<boolean>} - true ถ้าสำเร็จ, false ถ้าไม่สำเร็จ
 */
export async function markAsRead(notificationId, userId) {
  const notificationIdNum = Number(notificationId);

  const result = await sql`
    UPDATE notifications
    SET is_read = TRUE
    WHERE id = ${notificationIdNum} AND user_id = ${userId}
    RETURNING id
  `;

  return result.length > 0;
}
