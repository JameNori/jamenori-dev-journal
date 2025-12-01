import { body, validationResult } from "express-validator";

export const createCategoryValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .bail()
    .isLength({ min: 1, max: 100 })
    .withMessage("Category name must be between 1 and 100 characters"),
];

export const updateCategoryValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .bail()
    .isLength({ min: 1, max: 100 })
    .withMessage("Category name must be between 1 and 100 characters"),
];

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message:
        "Server could not process category because there are missing data from client",
      errors: errors.array(),
    });
  }

  next();
};
