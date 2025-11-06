import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import logger from "../utils/logger";

export function validationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorDetails: Record<string, string[]> = {};

    errors.array().forEach((error) => {
      if ("path" in error && error.path) {
        const path = error.path as string;
        if (!errorDetails[path]) {
          errorDetails[path] = [];
        }
        errorDetails[path].push(error.msg);
      }
    });

    logger.warn("Validation error", {
      errors: errorDetails,
    });

    res.status(400).json({
      message: "Validation failed",
      code: "validation_error",
      details: errorDetails,
    });
    return;
  }

  next();
}
