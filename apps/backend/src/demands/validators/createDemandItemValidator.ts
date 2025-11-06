import { body } from 'express-validator';

export const createDemandItemValidator = [
   body('description')
      .notEmpty()
      .withMessage('Description is required')
      .isString()
      .withMessage('Description must be a string')
      .trim()
      .notEmpty()
      .withMessage('Description cannot be empty'),

   body('plannedTotalTons')
      .notEmpty()
      .withMessage('Planned total tons is required')
      .isFloat({ min: 0 })
      .withMessage('Planned total tons must be a non-negative number'),

   body('producedTotalTons')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Produced total tons must be a non-negative number'),
];

