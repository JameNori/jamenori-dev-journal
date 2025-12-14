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
    LEFT JOIN users u ON n.actor_user_id = u.id
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
 * สร้าง notification เมื่อ admin สร้าง article ใหม่
 * ส่ง notification ให้ทุก user
 * @param {string} postId - ID ของ post ที่ admin สร้าง
 * @param {string} adminId - ID ของ admin ที่สร้าง post
 * @returns {Promise<number>} - จำนวน notifications ที่สร้างได้
 */
export async function createNewArticleNotification(postId, adminId) {
  const postIdNum = Number(postId);

  console.log("🔍 [createNewArticleNotification] Called with:", {
    postId,
    postIdType: typeof postId,
    postIdNum,
    postIdNumType: typeof postIdNum,
    adminId,
    adminIdType: typeof adminId,
  });

  // ดึงข้อมูล post
  const post = await sql`
    SELECT id, title FROM posts WHERE id = ${postIdNum} LIMIT 1
  `;

  console.log("🔍 [createNewArticleNotification] Post found:", post);
  console.log("🔍 [createNewArticleNotification] Post length:", post.length);

  if (post.length === 0) {
    console.log(
      "⚠️ [createNewArticleNotification] Post not found, returning 0"
    );
    return 0;
  }

  // ดึง user ทั้งหมด (ยกเว้น admin ที่สร้าง post)
  const users = await sql`
    SELECT id FROM users WHERE id != ${adminId}
  `;

  console.log(
    "🔍 [createNewArticleNotification] Users found (excluding admin):",
    {
      count: users.length,
      users: users,
      adminId: adminId,
    }
  );

  if (users.length === 0) {
    console.log(
      "⚠️ [createNewArticleNotification] No users found, returning 0"
    );
    return 0;
  }

  // Insert notifications ทีละแถว
  let insertedCount = 0;
  for (const user of users) {
    try {
      console.log(
        `🔍 [createNewArticleNotification] Inserting notification for user:`,
        {
          userId: user.id,
          userIdType: typeof user.id,
          postId: postIdNum,
          type: "new_article",
          actorId: adminId,
        }
      );
      await sql`
        INSERT INTO notifications (user_id, post_id, type, actor_user_id)
        VALUES (${user.id}, ${postIdNum}, ${"new_article"}, ${adminId})
      `;
      insertedCount++;
      console.log(
        `✅ [createNewArticleNotification] Inserted notification for user ${user.id}`
      );
    } catch (error) {
      console.error(
        `❌ [createNewArticleNotification] Error inserting notification for user ${user.id}:`,
        error
      );
      console.error(`❌ [createNewArticleNotification] Error details:`, {
        user_id: user.id,
        user_id_type: typeof user.id,
        post_id: postIdNum,
        post_id_type: typeof postIdNum,
        type: "new_article",
        actor_user_id: adminId,
        actor_user_id_type: typeof adminId,
        error_message: error.message,
        error_stack: error.stack,
      });
    }
  }

  console.log(
    `✅ [createNewArticleNotification] Total notifications created: ${insertedCount}`
  );
  return insertedCount;
}

/**
 * สร้าง notification เมื่อมี user comment บน post ที่ user อื่นเคย comment ไว้แล้ว
 * ส่ง notification ให้ทุก user ที่เคย comment บน post นั้น (ยกเว้น user ที่ comment ใหม่)
 * @param {string} postId - ID ของ post ที่ถูก comment
 * @param {string} userId - ID ของ user ที่ comment ใหม่
 * @param {number} commentId - ID ของ comment ที่สร้าง
 * @returns {Promise<number>} - จำนวน notifications ที่สร้างได้
 */
export async function createCommentReplyNotification(
  postId,
  userId,
  commentId
) {
  const postIdNum = Number(postId);
  const commentIdNum = Number(commentId);

  console.log("🔍 [createCommentReplyNotification] Called with:", {
    postId,
    postIdType: typeof postId,
    postIdNum,
    userId,
    userIdType: typeof userId,
    commentId,
    commentIdType: typeof commentId,
    commentIdNum,
  });

  // ดึง user ทั้งหมดที่เคย comment บน post นี้ (ยกเว้น user ที่ comment ใหม่)
  const previousCommenters = await sql`
    SELECT DISTINCT user_id
    FROM comments
    WHERE post_id = ${postIdNum} AND user_id != ${userId}
  `;

  console.log(
    "🔍 [createCommentReplyNotification] Previous commenters found:",
    {
      count: previousCommenters.length,
      commenters: previousCommenters,
      postId: postIdNum,
      currentUserId: userId,
    }
  );

  if (previousCommenters.length === 0) {
    console.log(
      "⚠️ [createCommentReplyNotification] No previous commenters found, returning 0"
    );
    return 0;
  }

  // Insert notifications ทีละแถว
  let insertedCount = 0;
  for (const commenter of previousCommenters) {
    try {
      console.log(
        `🔍 [createCommentReplyNotification] Inserting notification for user:`,
        {
          userId: commenter.user_id,
          userIdType: typeof commenter.user_id,
          postId: postIdNum,
          type: "comment_reply",
          actorId: userId,
          commentId: commentIdNum,
        }
      );
      await sql`
        INSERT INTO notifications (user_id, post_id, type, actor_user_id, comment_id)
        VALUES (${
          commenter.user_id
        }, ${postIdNum}, ${"comment_reply"}, ${userId}, ${commentIdNum})
      `;
      insertedCount++;
      console.log(
        `✅ [createCommentReplyNotification] Inserted notification for user ${commenter.user_id}`
      );
    } catch (error) {
      console.error(
        `❌ [createCommentReplyNotification] Error inserting notification for user ${commenter.user_id}:`,
        error
      );
      console.error(`❌ [createCommentReplyNotification] Error details:`, {
        user_id: commenter.user_id,
        user_id_type: typeof commenter.user_id,
        post_id: postIdNum,
        type: "comment_reply",
        actor_user_id: userId,
        actor_user_id_type: typeof userId,
        comment_id: commentIdNum,
        error_message: error.message,
        error_stack: error.stack,
      });
    }
  }

  console.log(
    `✅ [createCommentReplyNotification] Total notifications created: ${insertedCount}`
  );
  return insertedCount;
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
