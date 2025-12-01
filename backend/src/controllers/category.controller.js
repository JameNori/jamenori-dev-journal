import * as categoryService from "../services/category.service.js";

/**
 * READ (All)
 * Endpoint: GET /categories
 * รองรับ query: keyword (optional)
 */
export const getAllCategories = async (req, res) => {
  try {
    const { keyword } = req.query;

    const data = await categoryService.getAllCategories({
      keyword,
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error reading categories:", error);

    return res.status(500).json({
      message: "Server could not read categories because database connection",
      error: error.message,
    });
  }
};

/**
 * READ (One)
 * Endpoint: GET /categories/:categoryId
 * Success: คืน object ของ category
 * 404: ถ้าไม่เจอ category
 */
export const getCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await categoryService.getCategoryById(categoryId);

    if (!category) {
      return res.status(404).json({
        message: "Server could not find a requested category",
      });
    }

    return res.status(200).json(category);
  } catch (error) {
    console.error("Error reading category:", error);

    return res.status(500).json({
      message: "Server could not read category because database connection",
      error: error.message,
    });
  }
};

/**
 * CREATE
 * Endpoint: POST /categories
 * Success: 201 + { message: "Created category successfully", category: {...} }
 * Fail:
 *  - 400 ถ้าข้อมูลจาก client ไม่ครบ หรือชื่อซ้ำ
 *  - 500 ถ้า error จาก database
 */
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        message:
          "Server could not create category because there are missing data from client",
      });
    }

    const category = await categoryService.createCategory({ name });

    return res.status(201).json({
      message: "Created category successfully",
      category,
    });
  } catch (error) {
    console.error("Error creating category:", error);

    if (error.message === "Category name already exists") {
      return res.status(400).json({
        message: "Category name already exists",
        error: error.message,
      });
    }

    return res.status(500).json({
      message: "Server could not create category because database connection",
      error: error.message,
    });
  }
};

/**
 * UPDATE
 * Endpoint: PUT /categories/:categoryId
 * Success: 200 + { message: "Updated category successfully", category: {...} }
 * 404: ถ้าไม่เจอ category ให้แก้ไข
 * 400: ถ้าข้อมูลไม่ครบ หรือชื่อซ้ำ
 * 500: ถ้า error จาก database
 */
export const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        message:
          "Server could not update category because there are missing data from client",
      });
    }

    const category = await categoryService.updateCategory(categoryId, { name });

    if (!category) {
      return res.status(404).json({
        message: "Server could not find a requested category",
      });
    }

    return res.status(200).json({
      message: "Updated category successfully",
      category,
    });
  } catch (error) {
    console.error("Error updating category:", error);

    if (error.message === "Category name already exists") {
      return res.status(400).json({
        message: "Category name already exists",
        error: error.message,
      });
    }

    return res.status(500).json({
      message: "Server could not update category because database connection",
      error: error.message,
    });
  }
};

/**
 * DELETE
 * Endpoint: DELETE /categories/:categoryId
 * Success: 200 + { message: "Deleted category successfully", category: {...} }
 * 404: ถ้าไม่เจอ category ให้ลบ
 * 400: ถ้า category ถูกใช้งานโดย posts
 * 500: ถ้า error จาก database
 */
export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await categoryService.deleteCategory(categoryId);

    if (!category) {
      return res.status(404).json({
        message: "Server could not find a requested category",
      });
    }

    return res.status(200).json({
      message: "Deleted category successfully",
      category,
    });
  } catch (error) {
    console.error("Error deleting category:", error);

    if (error.message.includes("being used by posts")) {
      return res.status(400).json({
        message: "Cannot delete category because it is being used by posts",
        error: error.message,
      });
    }

    return res.status(500).json({
      message: "Server could not delete category because database connection",
      error: error.message,
    });
  }
};
