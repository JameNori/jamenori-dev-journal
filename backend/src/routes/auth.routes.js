import { Router } from "express";
import supabase from "../utils/supabase.js";
import sql from "../db/db.js";

const authRouter = Router();

/**
 * POST /auth/register
 * ลงทะเบียนผู้ใช้ใหม่
 * Body: { email, password, username, name }
 */
authRouter.post("/register", async (req, res) => {
  const { email, password, username, name } = req.body;

  try {
    // ตรวจสอบว่ามี username ซ้ำหรือไม่
    const existingUser = await sql`
      SELECT * FROM users
      WHERE username = ${username}
    `;

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "This username is already taken" });
    }

    // สร้าง user ใน Supabase Auth
    const { data, error: supabaseError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (supabaseError) {
      if (supabaseError.code === "user_already_exists") {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }
      return res
        .status(400)
        .json({ error: "Failed to create user. Please try again." });
    }

    const supabaseUserId = data.user.id;

    // สร้าง record ในตาราง users
    const [newUser] = await sql`
      INSERT INTO users (id, username, name, role)
      VALUES (${supabaseUserId}, ${username}, ${name}, 'user')
      RETURNING *
    `;

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "An error occurred during registration" });
  }
});

/**
 * POST /auth/login
 * เข้าสู่ระบบ
 * Body: { email, password }
 */
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (
        error.code === "invalid_credentials" ||
        error.message.includes("Invalid login credentials")
      ) {
        return res.status(400).json({
          error: "Your password is incorrect or this email doesn't exist",
        });
      }
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Signed in successfully",
      access_token: data.session.access_token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "An error occurred during login" });
  }
});

/**
 * GET /auth/get-user
 * ดึงข้อมูลผู้ใช้ปัจจุบัน
 * Headers: Authorization: Bearer <token>
 */
authRouter.get("/get-user", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      return res.status(401).json({ error: "Unauthorized or token expired" });
    }

    const supabaseUserId = data.user.id;

    // Query user data จาก database
    const [user] = await sql`
      SELECT * FROM users
      WHERE id = ${supabaseUserId}
    `;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      id: data.user.id,
      email: data.user.email,
      username: user.username,
      name: user.name,
      role: user.role,
      profilePic: user.profile_pic,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * PUT /auth/reset-password
 * เปลี่ยนรหัสผ่าน
 * Headers: Authorization: Bearer <token>
 * Body: { oldPassword, newPassword }
 */
authRouter.put("/reset-password", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { oldPassword, newPassword } = req.body;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  if (!newPassword) {
    return res.status(400).json({ error: "New password is required" });
  }

  try {
    // ดึงข้อมูล user จาก token
    const { data: userData } = await supabase.auth.getUser(token);

    if (!userData.user) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // ตรวจสอบ old password โดยการ login
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: userData.user.email,
      password: oldPassword,
    });

    if (loginError) {
      return res.status(400).json({ error: "Invalid old password" });
    }

    // Update password
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default authRouter;
