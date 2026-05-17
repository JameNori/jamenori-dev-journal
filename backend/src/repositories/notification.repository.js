import sql from "../db/db.js";

export async function findPostById(postId) {
  const [post] = await sql`
    SELECT id, user_id, title
    FROM posts
    WHERE id = ${postId}
    LIMIT 1
  `;

  return post || null;
}

export async function findUserIdsExcept(excludedUserId) {
  return sql`
    SELECT id FROM users WHERE id != ${excludedUserId}
  `;
}

export async function findDistinctCommenterUserIds(postId, excludedUserId) {
  return sql`
    SELECT DISTINCT user_id
    FROM comments
    WHERE post_id = ${postId} AND user_id != ${excludedUserId}
  `;
}

/**
 * Insert notification ตัวเดียว
 * commentId เป็น optional (NULL สำหรับ type 'like', 'new_article')
 */
export async function insert({
  recipientId,
  postId,
  type,
  actorUserId,
  commentId = null,
}) {
  const [created] = await sql`
    INSERT INTO notifications (user_id, post_id, type, actor_user_id, comment_id)
    VALUES (${recipientId}, ${postId}, ${type}, ${actorUserId}, ${commentId})
    RETURNING id, user_id, post_id, type, actor_user_id, comment_id, is_read, created_at
  `;

  return created || null;
}

export async function findByUserIdWithPagination(userId, { limit, offset }) {
  return sql`
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
    LIMIT ${limit} OFFSET ${offset}
  `;
}

export async function countByUserId(userId) {
  const [row] = await sql`
    SELECT COUNT(*)::INT AS total
    FROM notifications
    WHERE user_id = ${userId}
  `;

  return row?.total ?? 0;
}

export async function countUnreadByUserId(userId) {
  const [row] = await sql`
    SELECT COUNT(*)::INT AS count
    FROM notifications
    WHERE user_id = ${userId} AND is_read = FALSE
  `;

  return row?.count ?? 0;
}

export async function markAsRead(notificationId, userId) {
  const result = await sql`
    UPDATE notifications
    SET is_read = TRUE
    WHERE id = ${notificationId} AND user_id = ${userId}
    RETURNING id
  `;

  return result.length > 0;
}
