import * as postService from "../services/post.service.js";
import supabase from "../utils/supabase.js";

/**
 * CREATE
 * Endpoint: POST /posts
 * Success: 201 + { message: "Created post successfully" }
 * Fail:
 *  - 400 ถ้าข้อมูลจาก client ไม่ครบ หรือไฟล์ไม่ถูกต้อง
 *  - 500 ถ้า error จาก database หรือ Supabase Storage
 */
export const createPost = async (req, res) => {
  try {
    const { title, image, category_id, description, content, status_id } =
      req.body;

    // เช็ก required fields (ยกเว้น image เพราะอาจจะส่ง imageFile แทน)
    if (!title || !category_id || !description || !content || !status_id) {
      return res.status(400).json({
        message:
          "Server could not create post because there are missing data from client",
      });
    }

    let imageUrl = image; // ใช้ image URL ที่ส่งมา (ถ้ามี)

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
          message:
            "Invalid file type. Please upload a valid image file (JPEG, PNG, GIF, WebP).",
        });
      }

      // ตรวจสอบขนาดไฟล์ (5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return res.status(400).json({
          message:
            "File size too large. Please upload an image smaller than 5MB.",
        });
      }

      // กำหนด bucket และ path ที่จะเก็บไฟล์ใน Supabase
      const bucketName = "my-personal-blog";
      const filePath = `posts/${Date.now()}_${file.originalname}`;

      // อัปโหลดไฟล์ไปยัง Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false, // ป้องกันการเขียนทับไฟล์เดิม
        });

      if (error) {
        console.error("Supabase Storage upload error:", error);
        return res.status(500).json({
          message: "Server could not upload image to storage",
          error: error.message,
        });
      }

      // ดึง URL สาธารณะของไฟล์ที่อัปโหลด
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucketName).getPublicUrl(data.path);

      imageUrl = publicUrl;
    }

    // ถ้าไม่มี imageFile และไม่มี image URL → error
    if (!imageUrl) {
      return res.status(400).json({
        message:
          "Image is required. Please upload an image file or provide image URL.",
      });
    }

    // บันทึกข้อมูลโพสต์ลงในฐานข้อมูล
    await postService.createPost({
      title,
      image: imageUrl,
      category_id,
      description,
      content,
      status_id,
    });

    return res.status(201).json({
      message: "Created post successfully",
    });
  } catch (err) {
    console.error("Error creating post:", err);

    return res.status(500).json({
      message: "Server could not create post because database connection",
      error: err.message,
    });
  }
};

/**
 * READ (All)
 * Endpoint: GET /posts
 * รองรับ query: page, limit, category, keyword
 */
export const getAllPosts = async (req, res) => {
  try {
    const { page, limit, category, keyword } = req.query;

    const data = await postService.getAllPosts({
      page,
      limit,
      category,
      keyword,
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error reading posts:", error);

    return res.status(500).json({
      message: "Server could not read post because database connection",
    });
  }
};

/**
 * READ (One)
 * Endpoint: GET /posts/:postId
 * Success: คืน object ของ post
 * 404: ถ้าไม่เจอ post
 */
export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await postService.getPostById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Server could not find a requested post",
      });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error("Error reading post:", error);

    return res.status(500).json({
      message: "Server could not read post because database connection",
    });
  }
};

/**
 * UPDATE
 * Endpoint: PUT /posts/:postId
 * Success: 200 + { message: "Updated post successfully" }
 * 404: ถ้าไม่เจอ post ให้แก้ไข
 * 400: ถ้าไฟล์ไม่ถูกต้อง
 * 500: ถ้า error จาก database หรือ Supabase Storage
 */
export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, image, category_id, description, content, status_id } =
      req.body;

    // เช็ก required fields (ยกเว้น image เพราะอาจจะส่ง imageFile แทน)
    if (!title || !category_id || !description || !content || !status_id) {
      return res.status(400).json({
        message:
          "Server could not update post because there are missing data from client",
      });
    }

    let imageUrl = image; // ใช้ image URL ที่ส่งมา (ถ้ามี)

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
          message:
            "Invalid file type. Please upload a valid image file (JPEG, PNG, GIF, WebP).",
        });
      }

      // ตรวจสอบขนาดไฟล์ (5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return res.status(400).json({
          message:
            "File size too large. Please upload an image smaller than 5MB.",
        });
      }

      // กำหนด bucket และ path ที่จะเก็บไฟล์ใน Supabase
      const bucketName = "my-personal-blog";
      const filePath = `posts/${Date.now()}_${file.originalname}`;

      // อัปโหลดไฟล์ไปยัง Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false, // ป้องกันการเขียนทับไฟล์เดิม
        });

      if (error) {
        console.error("Supabase Storage upload error:", error);
        return res.status(500).json({
          message: "Server could not upload image to storage",
          error: error.message,
        });
      }

      // ดึง URL สาธารณะของไฟล์ที่อัปโหลด
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucketName).getPublicUrl(data.path);

      imageUrl = publicUrl;
    }

    // ถ้าไม่มี imageFile และไม่มี image URL → error
    if (!imageUrl) {
      return res.status(400).json({
        message:
          "Image is required. Please upload an image file or provide image URL.",
      });
    }

    // อัปเดตข้อมูลโพสต์ในฐานข้อมูล
    const updated = await postService.updatePost(postId, {
      title,
      image: imageUrl,
      category_id,
      description,
      content,
      status_id,
    });

    if (!updated) {
      return res.status(404).json({
        message: "Server could not find a requested post to update",
      });
    }

    return res.status(200).json({
      message: "Updated post successfully",
    });
  } catch (error) {
    console.error("Error updating post:", error);

    return res.status(500).json({
      message: "Server could not update post because database connection",
      error: error.message,
    });
  }
};

/**
 * DELETE
 * Endpoint: DELETE /posts/:postId
 * Success: 200 + { message: "Deleted post successfully" }
 * 404: ถ้าไม่เจอ post ให้ลบ
 */
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const deleted = await postService.deletePost(postId);

    if (!deleted) {
      return res.status(404).json({
        message: "Server could not find a requested post to delete",
      });
    }

    return res.status(200).json({
      message: "Deleted post successfully",
    });
  } catch (error) {
    console.error("Error deleting post:", error);

    return res.status(500).json({
      message: "Server could not delete post because database connection",
    });
  }
};
