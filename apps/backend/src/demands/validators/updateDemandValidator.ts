import { body } from "express-validator";
import { DemandStatus } from "../entities/DemandStatus";

export const updateDemandValidator = [
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
    .toDate(),
];
