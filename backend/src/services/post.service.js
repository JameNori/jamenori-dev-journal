import sql from "../db/db.js";

/**
 * สร้างโพสต์ใหม่ในตาราง posts
 * ใช้กับ endpoint: POST /posts
 */
export async function createPost(data) {
  const { title, image, category_id, description, content, status_id } = data;

  // ใช้ sql template literal เพื่อป้องกัน SQL injection
  const result = await sql`
    INSERT INTO posts (title, image, category_id, description, content, status_id)
    VALUES (
      ${title},
      ${image},
      ${Number(category_id)},
      ${description},
      ${content},
      ${Number(status_id)}
    )
    RETURNING id;
  `;

  // result เป็น array ของแถวที่ return มา (ไม่ใช่ result.rows แบบ pg)
  return result[0]; // { id: ... }
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
  // บังคับให้เป็น number
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 6;
  const offset = (pageNumber - 1) * limitNumber;

  // เก็บเงื่อนไข WHERE เป็น array ของ sql fragment
  const whereClauses = [];

  // Filter: category_id
  if (category) {
    whereClauses.push(sql`p.category_id = ${Number(category)}`);
  }

  // Filter keyword: title / description / content (ILIKE)
  if (keyword) {
    const pattern = `%${keyword}%`;
    whereClauses.push(
      sql`(
        p.title ILIKE ${pattern} OR
        p.description ILIKE ${pattern} OR
        p.content ILIKE ${pattern}
      )`
    );
  }

  // ประกอบ WHERE ถ้ามีเงื่อนไข
  // ใช้วิธี manual join แทน sql.join() เพราะ postgres package ไม่มี method นี้
  let whereSQL = sql``;
  if (whereClauses.length > 0) {
    // รวม whereClauses ด้วย AND แบบ manual โดยใช้ reduce
    whereSQL = whereClauses.reduce((acc, clause, index) => {
      if (index === 0) {
        return sql`WHERE ${clause}`;
      }
      return sql`${acc} AND ${clause}`;
    }, sql``);
  }

  // นับจำนวนโพสต์ทั้งหมดตามเงื่อนไข (ใช้สำหรับ totalPages)
  const countResult = await sql`
    SELECT COUNT(*)::INT AS total
    FROM posts p
    ${whereSQL}
  `;
  const totalPosts = countResult[0]?.total ?? 0;
  const totalPages = Math.ceil(totalPosts / limitNumber) || 1;

  // ดึงข้อมูลโพสต์จริง ตามหน้า + limit
  // JOIN กับ categories table เพื่อส่ง category name และ category_id
  const posts = await sql`
    SELECT
      p.id,
      p.title,
      p.image,
      p.description,
      p.content,
      p.category_id,
      c.name AS category,
      p.status_id,
      p.date,
      p.likes_count
    FROM posts p
    LEFT JOIN categories c ON p.category_id = c.id
    ${whereSQL}
    ORDER BY p.id DESC
    LIMIT ${limitNumber} OFFSET ${offset}
  `;

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

  const result = await sql`
    SELECT 
      p.id,
      p.image,
      c.name AS category,
      p.title,
      p.description,
      p.date,
      p.content,
      s.status,
      p.likes_count
    FROM posts p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN statuses s ON p.status_id = s.id
    WHERE p.id = ${id}
    LIMIT 1;
  `;

  if (result.length === 0) {
    return null; // ให้ controller ไปส่ง 404
  }

  // คืนค่าให้ field
  const row = result[0];
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
  const { title, image, category_id, description, content, status_id } = data;
  const id = Number(postId);

  const result = await sql`
    UPDATE posts
    SET
      title = ${title},
      image = ${image},
      category_id = ${Number(category_id)},
      description = ${description},
      content = ${content},
      status_id = ${Number(status_id)}
    WHERE id = ${id}
    RETURNING id;
  `;

  // ถ้าไม่มีแถวถูกอัปเดต = ไม่เจอ postId
  if (result.length === 0) {
    return null;
  }

  return result[0]; // { id: ... }
}

/**
 * ลบโพสต์
 * ใช้กับ endpoint: DELETE /posts/:postId
 */
export async function deletePost(postId) {
  const id = Number(postId);

  const result = await sql`
    DELETE FROM posts
    WHERE id = ${id}
    RETURNING id;
  `;

  // ถ้าไม่มีแถวถูกลบ = ไม่เจอ post
  if (result.length === 0) {
    return null;
  }

  return result[0]; // { id: ... }
}

/**
 * Toggle like/unlike post
 * ใช้กับ endpoint: POST /posts/:postId/like
 * ถ้ามี like อยู่แล้วจะ unlike, ถ้ายังไม่มีจะ like
 */
export async function toggleLike(postId, userId) {
  const postIdNum = Number(postId);

  // เช็คว่ามี like อยู่แล้วหรือไม่
  const existingLike = await sql`
    SELECT id FROM post_likes
    WHERE post_id = ${postIdNum} AND user_id = ${userId}
    LIMIT 1;
  `;

  if (existingLike.length > 0) {
    // ถ้ามี like อยู่แล้ว → unlike (ลบ like)
    await sql`
      DELETE FROM post_likes
      WHERE post_id = ${postIdNum} AND user_id = ${userId}
    `;

    // ลด likes_count ใน posts table
    await sql`
      UPDATE posts
      SET likes_count = GREATEST(likes_count - 1, 0)
      WHERE id = ${postIdNum}
    `;
  } else {
    // ถ้ายังไม่มี like → like (เพิ่ม like)
    await sql`
      INSERT INTO post_likes (post_id, user_id)
      VALUES (${postIdNum}, ${userId})
      ON CONFLICT (post_id, user_id) DO NOTHING
    `;

    // เพิ่ม likes_count ใน posts table
    await sql`
      UPDATE posts
      SET likes_count = COALESCE(likes_count, 0) + 1
      WHERE id = ${postIdNum}
    `;
  }

  // ดึง likes_count ใหม่
  const post = await sql`
    SELECT likes_count FROM posts WHERE id = ${postIdNum} LIMIT 1
  `;

  return {
    likes_count: post[0]?.likes_count || 0,
    hasLiked: existingLike.length === 0, // ถ้าไม่มี like อยู่แล้ว = เพิ่ง like
  };
}

/**
 * เช็คสถานะ like ของ user สำหรับ post
 * ใช้กับ endpoint: GET /posts/:postId/like/status
 */
export async function checkUserLike(postId, userId) {
  const postIdNum = Number(postId);

  const result = await sql`
    SELECT id FROM post_likes
    WHERE post_id = ${postIdNum} AND user_id = ${userId}
    LIMIT 1;
  `;

  return {
    hasLiked: result.length > 0,
  };
}

/**
 * ดึง comments ทั้งหมดของ post
 * ใช้กับ endpoint: GET /posts/:postId/comments
 */
export async function getComments(postId) {
  const postIdNum = Number(postId);

  const comments = await sql`
    SELECT 
      c.id,
      c.comment_text,
      c.created_at,
      c.user_id,
      u.name,
      u.profile_pic
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE c.post_id = ${postIdNum}
    ORDER BY c.created_at DESC
  `;

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

  const result = await sql`
    INSERT INTO comments (post_id, user_id, comment_text)
    VALUES (${postIdNum}, ${userId}, ${content})
    RETURNING id, comment_text, created_at, user_id;
  `;

  if (result.length === 0) {
    return null;
  }

  const newComment = result[0];

  // ดึง user info
  const user = await sql`
    SELECT name, profile_pic FROM users WHERE id = ${userId} LIMIT 1
  `;

  return {
    id: newComment.id,
    comment_id: newComment.id, // สำหรับ backward compatibility
    content: newComment.comment_text, // Map comment_text to content for frontend
    created_at: newComment.created_at,
    user: {
      id: newComment.user_id,
      name: user[0]?.name || "Anonymous",
      profilePic: user[0]?.profile_pic || null,
    },
  };
}
