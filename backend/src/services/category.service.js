import sql from "../db/db.js";

/**
 * ดึงรายการ categories ทั้งหมดแบบมี search
 * ใช้กับ endpoint: GET /categories
 * รองรับ query:
 * - keyword (optional, ค้นหา name)
 */
export async function getAllCategories({ keyword }) {
  // เก็บเงื่อนไข WHERE เป็น array ของ sql fragment
  const whereClauses = [];

  // Filter keyword: name (ILIKE)
  if (keyword) {
    const pattern = `%${keyword}%`;
    whereClauses.push(sql`c.name ILIKE ${pattern}`);
  }

  // ประกอบ WHERE ถ้ามีเงื่อนไข
  let whereSQL = sql``;
  if (whereClauses.length > 0) {
    whereSQL = whereClauses.reduce((acc, clause, index) => {
      if (index === 0) {
        return sql`WHERE ${clause}`;
      }
      return sql`${acc} AND ${clause}`;
    }, sql``);
  }

  // ดึงข้อมูล categories
  const categories = await sql`
    SELECT
      c.id,
      c.name
    FROM categories c
    ${whereSQL}
    ORDER BY c.id ASC
  `;

  return {
    categories,
  };
}

/**
 * ดึง category ตาม id หนึ่งตัว
 * ใช้กับ endpoint: GET /categories/:categoryId
 */
export async function getCategoryById(categoryId) {
  const id = Number(categoryId);

  const [category] = await sql`
    SELECT
      c.id,
      c.name
    FROM categories c
    WHERE c.id = ${id}
  `;

  return category || null;
}

/**
 * สร้าง category ใหม่
 * ใช้กับ endpoint: POST /categories
 */
export async function createCategory(data) {
  const { name } = data;

  // ตรวจสอบว่ามี category name ซ้ำหรือไม่
  const existingCategory = await sql`
    SELECT id FROM categories WHERE name = ${name}
  `;

  if (existingCategory.length > 0) {
    throw new Error("Category name already exists");
  }

  const result = await sql`
    INSERT INTO categories (name)
    VALUES (${name})
    RETURNING id, name;
  `;

  return result[0];
}

/**
 * อัปเดต category
 * ใช้กับ endpoint: PUT /categories/:categoryId
 */
export async function updateCategory(categoryId, data) {
  const id = Number(categoryId);
  const { name } = data;

  // ตรวจสอบว่ามี category name ซ้ำหรือไม่ (ยกเว้นตัวที่กำลังแก้ไข)
  const existingCategory = await sql`
    SELECT id FROM categories WHERE name = ${name} AND id != ${id}
  `;

  if (existingCategory.length > 0) {
    throw new Error("Category name already exists");
  }

  const result = await sql`
    UPDATE categories
    SET name = ${name}
    WHERE id = ${id}
    RETURNING id, name;
  `;

  if (result.length === 0) {
    return null; // ไม่เจอ category ที่จะแก้ไข
  }

  return result[0];
}

/**
 * ลบ category
 * ใช้กับ endpoint: DELETE /categories/:categoryId
 */
export async function deleteCategory(categoryId) {
  const id = Number(categoryId);

  // ตรวจสอบว่ามี posts ที่ใช้ category นี้อยู่หรือไม่
  const postsUsingCategory = await sql`
    SELECT COUNT(*)::INT AS count
    FROM posts
    WHERE category_id = ${id}
  `;

  if (postsUsingCategory[0]?.count > 0) {
    throw new Error("Cannot delete category because it is being used by posts");
  }

  const result = await sql`
    DELETE FROM categories
    WHERE id = ${id}
    RETURNING id, name;
  `;

  if (result.length === 0) {
    return null; // ไม่เจอ category ที่จะลบ
  }

  return result[0];
}
