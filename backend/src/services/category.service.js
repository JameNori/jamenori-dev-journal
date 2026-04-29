import * as categoryRepo from "../repositories/category.repository.js";

/**
 * ดึงรายการ categories ทั้งหมด (รองรับ keyword)
 * ใช้กับ endpoint: GET /categories
 */
export async function getAllCategories({ keyword } = {}) {
  const categories = await categoryRepo.findAll({ keyword });
  return { categories };
}

/**
 * ดึง category ตาม id
 * ใช้กับ endpoint: GET /categories/:categoryId
 */
export async function getCategoryById(categoryId) {
  return categoryRepo.findById(Number(categoryId));
}

/**
 * สร้าง category ใหม่ — กันชื่อซ้ำก่อน insert
 * ใช้กับ endpoint: POST /categories
 */
export async function createCategory(data) {
  const { name } = data;

  const existing = await categoryRepo.findByName(name);
  if (existing) {
    throw new Error("Category name already exists");
  }

  return categoryRepo.create({ name });
}

/**
 * อัปเดต category — กันชื่อซ้ำกับ category อื่น
 * ใช้กับ endpoint: PUT /categories/:categoryId
 */
export async function updateCategory(categoryId, data) {
  const id = Number(categoryId);
  const { name } = data;

  const existing = await categoryRepo.findByNameExceptId(name, id);
  if (existing) {
    throw new Error("Category name already exists");
  }

  return categoryRepo.update(id, { name });
}

/**
 * ลบ category — ห้ามลบถ้ายังมี posts ใช้อยู่
 * ใช้กับ endpoint: DELETE /categories/:categoryId
 */
export async function deleteCategory(categoryId) {
  const id = Number(categoryId);

  const usageCount = await categoryRepo.countPostsUsingCategory(id);
  if (usageCount > 0) {
    throw new Error("Cannot delete category because it is being used by posts");
  }

  return categoryRepo.deleteById(id);
}
