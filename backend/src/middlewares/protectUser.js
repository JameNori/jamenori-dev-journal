import supabase from "../utils/supabase.js";

/**
 * Middleware สำหรับป้องกัน routes ที่ต้องการ authentication
 * ตรวจสอบ token จาก Authorization header และ verify กับ Supabase
 * ถ้าผ่าน จะใส่ user data ใน req.user
 */
const protectUser = async (req, res, next) => {
  // ดึง token จาก Authorization header
  // Format: "Bearer <token>"
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    // Verify token กับ Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // ใส่ user data ใน req.user เพื่อใช้ใน route handlers
    req.user = { ...data.user };

    // ไปต่อที่ route handler
    next();
  } catch (err) {
    console.error("ProtectUser middleware error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default protectUser;
