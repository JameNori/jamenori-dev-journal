import * as profileService from "../services/profile.service.js";
import supabase from "../utils/supabase.js";

/**
 * GET /profiles
 * ดึงข้อมูล profile ของ user ที่ login
 * Headers: Authorization: Bearer <token>
 */
export const handleGetProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ได้จาก protectUser หรือ protectAdmin middleware

    // ดึง email จาก Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.getUser(
      req.headers.authorization?.split(" ")[1]
    );

    if (authError || !authData.user) {
      return res.status(401).json({
        message: "Unauthorized or token expired",
      });
    }

    const profile = await profileService.getProfile(userId);

    if (!profile) {
      return res.status(404).json({
        message: "User profile not found",
      });
    }

    return res.status(200).json({
      id: profile.id,
      username: profile.username,
      name: profile.name,
      email: authData.user.email, // ดึงจาก Supabase Auth
      profilePic: profile.profile_pic,
      bio: profile.bio,
    });
  } catch (error) {
    console.error("Error reading profile:", error);

    return res.status(500).json({
      message: "Server could not read profile because database connection",
      error: error.message,
    });
  }
};

/**
 * PUT /profiles
 * อัปเดตข้อมูล profile
 * Headers: Authorization: Bearer <token>
 * Body: { name?, username?, bio?, image? } หรือ imageFile (multipart/form-data)
 */
export const handleUpdateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ได้จาก protectUser หรือ protectAdmin middleware
    const { name, username, bio, image } = req.body;

    let profilePicUrl = image; // ใช้ image URL ที่ส่งมา (ถ้ามี)

    // ถ้ามีไฟล์ใหม่ที่อัปโหลด → อัปโหลดไป Supabase Storage
    if (req.files && req.files.imageFile && req.files.imageFile[0]) {
      const file = req.files.imageFile[0];

      // ตรวจสอบประเภทไฟล์
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          message: "Invalid file type. Only JPEG, PNG, GIF, WebP are allowed.",
        });
      }

      // ตรวจสอบขนาดไฟล์ (5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return res.status(400).json({
          message: "File size too large. Maximum 5MB is allowed.",
        });
      }

      const bucketName = "my-personal-blog";
      const filePath = `profiles/${Date.now()}_${file.originalname}`;

      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        return res.status(500).json({
          message: "Server could not upload image to storage",
          error: uploadError.message,
        });
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucketName).getPublicUrl(data.path);
      profilePicUrl = publicUrl;
    }

    // เตรียม data สำหรับ update
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (username !== undefined) updateData.username = username;
    if (bio !== undefined) updateData.bio = bio;
    if (profilePicUrl !== undefined) updateData.profile_pic = profilePicUrl;

    // ถ้าไม่มีข้อมูลที่จะ update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message:
          "Server could not update profile because there are missing data from client",
      });
    }

    const updatedProfile = await profileService.updateProfile(
      userId,
      updateData
    );

    if (!updatedProfile) {
      return res.status(404).json({
        message: "User profile not found",
      });
    }

    // ดึง email จาก Supabase Auth
    const { data: authData } = await supabase.auth.getUser(
      req.headers.authorization?.split(" ")[1]
    );

    return res.status(200).json({
      message: "Updated profile successfully",
      profile: {
        id: updatedProfile.id,
        username: updatedProfile.username,
        name: updatedProfile.name,
        email: authData?.user?.email || null,
        profilePic: updatedProfile.profile_pic,
        bio: updatedProfile.bio,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);

    if (error.message === "Username already exists") {
      return res.status(400).json({
        message: "Username already exists",
        error: error.message,
      });
    }

    if (error.message === "No fields to update") {
      return res.status(400).json({
        message:
          "Server could not update profile because there are missing data from client",
        error: error.message,
      });
    }

    return res.status(500).json({
      message: "Server could not update profile because database connection",
      error: error.message,
    });
  }
};

/**
 * GET /profiles/admin
 * ดึงข้อมูล admin profile แบบ public (ไม่ต้องมี token)
 * ใช้สำหรับแสดงใน HeroSection
 */
export const handleGetAdminProfile = async (req, res) => {
  try {
    const adminProfile = await profileService.getAdminProfile();

    if (!adminProfile) {
      return res.status(404).json({
        message: "Admin profile not found",
      });
    }

    return res.status(200).json({
      name: adminProfile.name,
      bio: adminProfile.bio,
      profilePic: adminProfile.profile_pic,
    });
  } catch (error) {
    console.error("Error reading admin profile:", error);

    return res.status(500).json({
      message: "Server could not read admin profile",
      error: error.message,
    });
  }
};
