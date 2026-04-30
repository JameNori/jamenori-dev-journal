import * as profileRepo from "../repositories/profile.repository.js";

/**
 * ดึงข้อมูล profile ของ user
 * ใช้กับ endpoint: GET /profiles
 */
export async function getProfile(userId) {
  return profileRepo.findById(userId);
}

/**
 * อัปเดต profile — กัน username ซ้ำ + ต้องมีอย่างน้อย 1 field
 * ใช้กับ endpoint: PUT /profiles
 */
export async function updateProfile(userId, data) {
  const { name, username, bio, profile_pic } = data;

  // กัน username ซ้ำ (ยกเว้นตัวเอง)
  if (username) {
    const existing = await profileRepo.findByUsernameExceptId(username, userId);
    if (existing) {
      throw new Error("Username already exists");
    }
  }

  // เก็บเฉพาะ fields ที่ caller ส่งมา (defined)
  const fields = {};
  if (name !== undefined) fields.name = name;
  if (username !== undefined) fields.username = username;
  if (bio !== undefined) fields.bio = bio;
  if (profile_pic !== undefined) fields.profile_pic = profile_pic;

  if (Object.keys(fields).length === 0) {
    throw new Error("No fields to update");
  }

  return profileRepo.update(userId, fields);
}

/**
 * ดึงข้อมูล admin profile (public, ไม่ต้องมี token)
 * ใช้กับ endpoint: GET /profiles/admin
 */
export async function getAdminProfile() {
  return profileRepo.findAdmin();
}
