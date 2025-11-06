import { param } from "express-validator";

export const getItemIdValidator = [
  param("itemId")
    .isInt({ min: 1 })
    .withMessage("Item ID (SKU) must be a valid positive integer")
    .toInt(),
];
