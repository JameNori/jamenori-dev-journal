import sql from "../db/db.js";

export async function findAll({ keyword } = {}) {
  if (keyword) {
    const pattern = `%${keyword}%`;
    return sql`
      SELECT c.id, c.name
      FROM categories c
      WHERE c.name ILIKE ${pattern}
      ORDER BY c.id ASC
    `;
  }

  return sql`
    SELECT c.id, c.name
    FROM categories c
    ORDER BY c.id ASC
  `;
}

export async function findById(id) {
  const [category] = await sql`
    SELECT c.id, c.name
    FROM categories c
    WHERE c.id = ${id}
  `;

  return category || null;
}

export async function findByName(name) {
  const [category] = await sql`
    SELECT id FROM categories WHERE name = ${name}
  `;

  return category || null;
}

export async function findByNameExceptId(name, id) {
  const [category] = await sql`
    SELECT id FROM categories WHERE name = ${name} AND id != ${id}
  `;

  return category || null;
}

export async function countPostsUsingCategory(id) {
  const result = await sql`
    SELECT COUNT(*)::INT AS count
    FROM posts
    WHERE category_id = ${id}
  `;

  return result[0]?.count ?? 0;
}

export async function create({ name }) {
  const [created] = await sql`
    INSERT INTO categories (name)
    VALUES (${name})
    RETURNING id, name;
  `;

  return created;
}

export async function update(id, { name }) {
  const [updated] = await sql`
    UPDATE categories
    SET name = ${name}
    WHERE id = ${id}
    RETURNING id, name;
  `;

  return updated || null;
}

export async function deleteById(id) {
  const [deleted] = await sql`
    DELETE FROM categories
    WHERE id = ${id}
    RETURNING id, name;
  `;

  return deleted || null;
}
