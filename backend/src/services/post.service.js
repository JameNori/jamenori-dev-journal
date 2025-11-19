import db from "../db/db.js";

export async function createPost(data) {
  const { title, image, category_id, description, content, status_id } = data;

  const query = `
    INSERT INTO posts (title, image, category_id, description, content, status_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id;
  `;

  const values = [
    title,
    image,
    Number(category_id),
    description,
    content,
    Number(status_id),
  ];

  const result = await db.query(query, values);

  return result.rows[0];
}

export async function getAllPosts({ page = 1, limit = 6, category, keyword }) {
  const offset = (page - 1) * limit;

  let baseQuery = `
      SELECT 
        p.id,
        p.title,
        p.image,
        p.description,
        p.content,
        p.category_id,
        p.status_id,
        p.date,
        p.likes_count
      FROM posts p
    `;

  let whereClauses = [];
  let values = [];
  let index = 1;

  // Filter: category_id
  if (category) {
    whereClauses.push(`p.category_id = $${index}`);
    values.push(Number(category));
    index++;
  }

  // Search keyword in 3 fields
  if (keyword) {
    whereClauses.push(`
        (p.title ILIKE $${index} 
          OR p.description ILIKE $${index}
          OR p.content ILIKE $${index})
      `);
    values.push(`%${keyword}%`);
    index++;
  }

  // Combine WHERE
  if (whereClauses.length > 0) {
    baseQuery += " WHERE " + whereClauses.join(" AND ");
  }

  // Count posts
  const countQuery = `
      SELECT COUNT(*) AS total 
      FROM posts p
      ${whereClauses.length > 0 ? "WHERE " + whereClauses.join(" AND ") : ""}
    `;

  const countResult = await db.query(countQuery, values);
  const totalPosts = Number(countResult.rows[0].total);
  const totalPages = Math.ceil(totalPosts / limit);

  // Add ordering + pagination
  baseQuery += ` ORDER BY p.id DESC LIMIT ${limit} OFFSET ${offset}`;

  const result = await db.query(baseQuery, values);

  return {
    totalPosts,
    totalPages,
    currentPage: Number(page),
    limit: Number(limit),
    nextPage: page < totalPages ? Number(page) + 1 : null,
    posts: result.rows,
  };
}

export async function getPostById(postId) {
  const query = `
      SELECT 
        p.id,
        p.title,
        p.image,
        p.description,
        p.content,
        p.category_id,
        p.status_id,
        p.date,
        p.likes_count
      FROM posts p
      WHERE p.id = $1
      LIMIT 1;
    `;

  const result = await db.query(query, [postId]);

  if (result.rows.length === 0) {
    return null; // ให้ controller ตรวจว่าไม่มีข้อมูล
  }

  return result.rows[0];
}
