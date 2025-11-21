import { body, validationResult } from "express-validator";

export const createPostValidationRules = [
  body("title").trim().notEmpty().withMessage("Title is required"),

  body("image").optional().isString().withMessage("Image must be a string"),

  body("category_id")
    .notEmpty()
    .withMessage("category_id is required")
    .bail()
    .isInt()
    .withMessage("category_id must be an integer"),

  body("description").trim().notEmpty().withMessage("Description is required"),

  body("content").trim().notEmpty().withMessage("Content is required"),

  body("status_id")
    .notEmpty()
    .withMessage("status_id is required")
    .bail()
    .isInt()
    .withMessage("status_id must be an integer"),
];

export const updatePostValidationRules = [
  body("title").trim().notEmpty().withMessage("Title is required"),

  body("image").trim().notEmpty().withMessage("Image is required"),

  body("category_id")
    .notEmpty()
    .withMessage("category_id is required")
    .bail()
    .isInt()
    .withMessage("category_id must be an integer"),

  body("description").trim().notEmpty().withMessage("Description is required"),

  body("content").trim().notEmpty().withMessage("Content is required"),

  body("status_id")
    .notEmpty()
    .withMessage("status_id is required")
    .bail()
    .isInt()
    .withMessage("status_id must be an integer"),
];

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message:
        "Server could not create post because there are missing data from client",
      errors: errors.array(),
    });
  }

  next();
};
