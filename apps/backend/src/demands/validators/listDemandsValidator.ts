import { query } from "express-validator";
import { DemandStatus } from "../entities/DemandStatus";

export const listDemandsValidator = [
  query("status")
    .optional()
    .isIn(Object.values(DemandStatus))
    .withMessage(
      `Status must be one of: ${Object.values(DemandStatus).join(", ")}`
    ),

  query("startsAfter")
    .optional()
    .isISO8601()
    .withMessage("startsAfter must be a valid ISO 8601 date (YYYY-MM-DD)"),

  query("endsBefore")
    .optional()
    .isISO8601()
    .withMessage("endsBefore must be a valid ISO 8601 date (YYYY-MM-DD)"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .toInt(),

  query("pageSize")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Page size must be between 1 and 100")
    .toInt(),
];
