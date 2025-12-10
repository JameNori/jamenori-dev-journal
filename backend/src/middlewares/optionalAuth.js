import supabase from "../utils/supabase.js";

/**
 * Middleware สำหรับ routes ที่ต้องการ optional authentication
 * ถ้ามี token จะ verify และใส่ user data ใน req.user
 * ถ้าไม่มี token จะให้ผ่านไปต่อ (req.user จะเป็น undefined)
 */
const optionalAuth = async (req, res, next) => {
  // ดึง token จาก Authorization header
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    // ถ้าไม่มี token ให้ผ่านไปต่อ (req.user จะเป็น undefined)
    return next();
  }

  try {
    // Verify token กับ Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      // ถ้า token ไม่ valid ให้ผ่านไปต่อ (req.user จะเป็น undefined)
      return next();
    }

    // ใส่ user data ใน req.user
    req.user = { ...data.user };

    // ไปต่อที่ route handler
    next();
  } catch (err) {
    console.error("OptionalAuth middleware error:", err);
    // ถ้า error ให้ผ่านไปต่อ (req.user จะเป็น undefined)
    return next();
  }
};

export default optionalAuth;
