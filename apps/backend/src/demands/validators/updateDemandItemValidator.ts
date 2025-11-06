import { body } from "express-validator";

export const updateDemandItemValidator = [
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),

  body("plannedTotalTons")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Planned total tons must be a non-negative number"),

  body("producedTotalTons")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Produced total tons must be a non-negative number"),

  body().custom((value) => {
    const hasAtLeastOneField =
      value.description !== undefined ||
      value.plannedTotalTons !== undefined ||
      value.producedTotalTons !== undefined;

    if (!hasAtLeastOneField) {
      throw new Error("At least one field must be provided for update");
    }
    return true;
  }),
];
