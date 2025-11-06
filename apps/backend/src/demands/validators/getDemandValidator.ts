import { param } from "express-validator";

export const getDemandValidator = [
  param("demandId").isUUID().withMessage("Demand ID must be a valid UUID"),
];
