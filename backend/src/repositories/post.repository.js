import sql from "../db/db.js";

function buildPostListWhere(category, keyword) {
  const whereClauses = [];
  if (category) {
    whereClauses.push(sql`p.category_id = ${Number(category)}`);
  }
  if (keyword) {
    const pattern = `%${keyword}%`;
    whereClauses.push(
      sql`(
        p.title ILIKE ${pattern} OR
        p.description ILIKE ${pattern} OR
        p.content ILIKE ${pattern}
      )`,
    );
  }
  if (whereClauses.length === 0) {
    return sql``;
  }
  return whereClauses.reduce(
    (acc, clause, index) => {
      if (index === 0) {
        return sql`WHERE ${clause}`;
      }
      return sql`${acc} AND ${clause}`;
    },
    sql``,
  );
}

export async function insert({
  title,
  image,
  category_id,
  description,
  content,
  status_id,
  user_id,
}) {
  const result = await sql`
    INSERT INTO posts (title, image, category_id, description, content, status_id, user_id)
    VALUES (
      ${title},
      ${image},
      ${Number(category_id)},
      ${description},
      ${content},
      ${Number(status_id)},
      ${user_id || null}
    )
    RETURNING id;
  `;

  return result[0];
}

export async function findPage({ category, keyword, limit, offset }) {
  const whereSQL = buildPostListWhere(category, keyword);

  const countResult = await sql`
    SELECT COUNT(*)::INT AS total
    FROM posts p
    ${whereSQL}
  `;

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
    LIMIT ${limit} OFFSET ${offset}
  `;

  return {
    total: countResult[0]?.total ?? 0,
    posts,
  };
}

export async function findById(id) {
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

  return result[0] ?? null;
}

export async function update(id, data) {
  const { title, image, category_id, description, content, status_id } = data;

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

  if (result.length === 0) {
    return null;
  }

  return result[0];
}

export async function deleteById(id) {
  const result = await sql`
    DELETE FROM posts
    WHERE id = ${id}
    RETURNING id;
  `;

  if (result.length === 0) {
    return null;
  }

  return result[0];
}

export async function toggleLike(postIdNum, userId) {
  const existingLike = await sql`
    SELECT id FROM post_likes
    WHERE post_id = ${postIdNum} AND user_id = ${userId}
    LIMIT 1;
  `;

  if (existingLike.length > 0) {
    await sql`
      DELETE FROM post_likes
      WHERE post_id = ${postIdNum} AND user_id = ${userId}
    `;

    await sql`
      UPDATE posts
      SET likes_count = GREATEST(likes_count - 1, 0)
      WHERE id = ${postIdNum}
    `;
  } else {
    await sql`
      INSERT INTO post_likes (post_id, user_id)
      VALUES (${postIdNum}, ${userId})
      ON CONFLICT (post_id, user_id) DO NOTHING
    `;

    await sql`
      UPDATE posts
      SET likes_count = COALESCE(likes_count, 0) + 1
      WHERE id = ${postIdNum}
    `;
  }

  const post = await sql`
    SELECT likes_count FROM posts WHERE id = ${postIdNum} LIMIT 1
  `;

  return {
    likes_count: post[0]?.likes_count || 0,
    hasLiked: existingLike.length === 0,
  };
}

export async function existsLike(postIdNum, userId) {
  const result = await sql`
    SELECT id FROM post_likes
    WHERE post_id = ${postIdNum} AND user_id = ${userId}
    LIMIT 1;
  `;

  return result.length > 0;
}

export async function findCommentsByPostId(postIdNum) {
  return sql`
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
}

export async function insertComment(postIdNum, userId, content) {
  const result = await sql`
    INSERT INTO comments (post_id, user_id, comment_text)
    VALUES (${postIdNum}, ${userId}, ${content})
    RETURNING id, comment_text, created_at, user_id;
  `;

  if (result.length === 0) {
    return null;
  }

  return result[0];
}

export async function findUserNameAndProfilePic(userId) {
  const user = await sql`
    SELECT name, profile_pic FROM users WHERE id = ${userId} LIMIT 1
  `;

  return user[0] ?? null;
}
