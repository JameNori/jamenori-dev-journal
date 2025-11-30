import supabase from "../utils/supabase.js";
import sql from "../db/db.js";

/**
 * Middleware สำหรับป้องกัน routes ที่ต้องการ admin access
 * ตรวจสอบ token และ role จาก database
 * อนุญาตเฉพาะ user ที่มี role = 'admin'
 */
const protectAdmin = async (req, res, next) => {
  // ดึง token จาก Authorization header
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

    const supabaseUserId = data.user.id;

    // Query role จาก database
    const [userRole] = await sql`
      SELECT role FROM users
      WHERE id = ${supabaseUserId}
    `;

    if (!userRole) {
      return res.status(404).json({ error: "User role not found" });
    }

    // ตรวจสอบว่าเป็น admin หรือไม่
    if (userRole.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Forbidden: You do not have admin access" });
    }

    // ใส่ user data พร้อม role ใน req.user
    req.user = { ...data.user, role: userRole.role };

    // ไปต่อที่ route handler
    next();
  } catch (err) {
    console.error("ProtectAdmin middleware error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default protectAdmin;
