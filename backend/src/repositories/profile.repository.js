import sql from "../db/db.js";

export async function findById(userId) {
  const [user] = await sql`
    SELECT id, username, name, profile_pic, bio
    FROM users
    WHERE id = ${userId}
  `;

  return user || null;
}

export async function findByUsernameExceptId(username, userId) {
  const [user] = await sql`
    SELECT id FROM users
    WHERE username = ${username} AND id != ${userId}
  `;

  return user || null;
}

/**
 * Dynamic UPDATE — รัน UPDATE เฉพาะ fields ที่ส่งมา
 * fields รองรับ: name, username, bio, profile_pic
 */
export async function update(userId, fields) {
  const setClauses = [];

  if (fields.name !== undefined) {
    setClauses.push(sql`name = ${fields.name}`);
  }
  if (fields.username !== undefined) {
    setClauses.push(sql`username = ${fields.username}`);
  }
  if (fields.bio !== undefined) {
    setClauses.push(sql`bio = ${fields.bio}`);
  }
  if (fields.profile_pic !== undefined) {
    setClauses.push(sql`profile_pic = ${fields.profile_pic}`);
  }

  // ประกอบ SET clause แบบ manual (postgres package ไม่มี sql.join)
  const setSQL = setClauses.reduce((acc, clause, index) => {
    if (index === 0) {
      return sql`SET ${clause}`;
    }
    return sql`${acc}, ${clause}`;
  }, sql``);

  const [updated] = await sql`
    UPDATE users
    ${setSQL}
    WHERE id = ${userId}
    RETURNING id, username, name, profile_pic, bio
  `;

  return updated || null;
}

export async function findAdmin() {
  const [admin] = await sql`
    SELECT name, bio, profile_pic
    FROM users
    WHERE role = 'admin'
    LIMIT 1
  `;

  return admin || null;
}
