import db from '../db/db.js';

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
