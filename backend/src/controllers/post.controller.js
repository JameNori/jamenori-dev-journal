import * as postService from "../services/post.service.js";

/**
 * CREATE
 * Endpoint: POST /posts
 * Success: 201 + { message: "Created post successfully" }
 * Fail:
 *  - 400 ถ้าข้อมูลจาก client ไม่ครบ
 *  - 500 ถ้า error จาก database
 */
export const createPost = async (req, res) => {
  try {
    const { title, image, category_id, content, status_id } = req.body;

    // เช็ก required fields
    if (!title || !image || !category_id || !content || !status_id) {
      return res.status(400).json({
        message:
          "Server could not create post because there are missing data from client",
      });
    }

    await postService.createPost(req.body);

    return res.status(201).json({
      message: "Created post successfully",
    });
  } catch (err) {
    console.error("Error creating post:", err);

    return res.status(500).json({
      message: "Server could not create post because database connection",
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
 */
export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const updated = await postService.updatePost(postId, req.body);

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
