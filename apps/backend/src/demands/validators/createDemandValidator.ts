import { body } from "express-validator";
import { DemandStatus } from "../entities/DemandStatus";

export const createDemandValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({
      min: 1,
      max: 140,
    })
    .withMessage("Title must be between 1 and 140 characters"),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string")
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(Object.values(DemandStatus))
    .withMessage(
      `Status must be one of: ${Object.values(DemandStatus).join(", ")}`
    ),

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date (YYYY-MM-DD)")
    .toDate(),

  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date (YYYY-MM-DD)")
    .toDate()
    .custom((value, { req }) => {
      const startDate = req.body.startDate
        ? new Date(req.body.startDate)
        : null;
      if (startDate && value < startDate) {
        throw new Error("End date must be greater than or equal to start date");
      }
      return true;
    }),

  body("items")
    .isArray({ min: 1 })
    .withMessage("At least one item is required")
    .custom((items) => {
      if (!Array.isArray(items)) {
        throw new Error("Items must be an array");
      }
      return true;
    }),

  body("items.*.description")
    .notEmpty()
    .withMessage("Item description is required")
    .isString()
    .withMessage("Item description must be a string")
    .trim()
    .notEmpty()
    .withMessage("Item description cannot be empty"),

  body("items.*.plannedTotalTons")
    .notEmpty()
    .withMessage("Planned total tons is required for each item")
    .isFloat({ min: 0 })
    .withMessage("Planned total tons must be a non-negative number"),
];
