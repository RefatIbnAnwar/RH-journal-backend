const { body, param } = require("express-validator");

exports.createEntryRules = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ max: 10000 })
    .withMessage("Content must be under 10000 characters"),

  body("title")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Title must be under 200 characters"),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),
];

exports.updateEntryRules = [
  param("id").isMongoId().withMessage("Invalid entry ID"),

  body("content")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Content cannot be empty")
    .isLength({ max: 10000 })
    .withMessage("Content must be under 10000 characters"),

  body("title")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Title must be under 200 characters"),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),
];

exports.entryIdRule = [
  param("id").isMongoId().withMessage("Invalid entry ID"),
];
