import sql from "../db/db.js";

/**
 * ดึงข้อมูล profile ของ user
 * ใช้กับ endpoint: GET /profiles
 */
export async function getProfile(userId) {
  const [user] = await sql`
    SELECT
      id,
      username,
      name,
      profile_pic,
      bio
    FROM users
    WHERE id = ${userId}
  `;

  if (!user) {
    return null;
  }

  return user;
}

/**
 * อัปเดตข้อมูล profile
 * ใช้กับ endpoint: PUT /profiles
 */
export async function updateProfile(userId, data) {
  const { name, username, bio, profile_pic } = data;

  // ตรวจสอบว่ามี username ซ้ำหรือไม่ (ยกเว้นตัวที่กำลังแก้ไข)
  if (username) {
    const existingUser = await sql`
      SELECT id FROM users WHERE username = ${username} AND id != ${userId}
    `;

    if (existingUser.length > 0) {
      throw new Error("Username already exists");
    }
  }

  // สร้าง object สำหรับ update (เฉพาะ fields ที่มีค่า)
  const updateFields = {};
  if (name !== undefined) updateFields.name = name;
  if (username !== undefined) updateFields.username = username;
  if (bio !== undefined) updateFields.bio = bio;
  if (profile_pic !== undefined) updateFields.profile_pic = profile_pic;

  // ถ้าไม่มี fields ที่จะ update
  if (Object.keys(updateFields).length === 0) {
    throw new Error("No fields to update");
  }

  // สร้าง SQL UPDATE statement แบบ dynamic
  const setClauses = [];
  const values = [];

  if (updateFields.name !== undefined) {
    setClauses.push(sql`name = ${updateFields.name}`);
  }
  if (updateFields.username !== undefined) {
    setClauses.push(sql`username = ${updateFields.username}`);
  }
  if (updateFields.bio !== undefined) {
    setClauses.push(sql`bio = ${updateFields.bio}`);
  }
  if (updateFields.profile_pic !== undefined) {
    setClauses.push(sql`profile_pic = ${updateFields.profile_pic}`);
  }

  // ประกอบ SET clause ด้วย manual join
  let setSQL = sql``;
  if (setClauses.length > 0) {
    setSQL = setClauses.reduce((acc, clause, index) => {
      if (index === 0) {
        return sql`SET ${clause}`;
      }
      return sql`${acc}, ${clause}`;
    }, sql``);
  }

  const result = await sql`
    UPDATE users
    ${setSQL}
    WHERE id = ${userId}
    RETURNING id, username, name, profile_pic, bio
  `;

  if (result.length === 0) {
    return null; // ไม่เจอ user ที่จะแก้ไข
  }

  return result[0];
}
