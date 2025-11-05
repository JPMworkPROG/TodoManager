import { Request, Response, NextFunction } from 'express';
import { DemandError, DemandValidationError, DemandConflictError } from '../demands/errors/DemandErrors';
import logger from '../utils/logger';

export function errorHandlerMiddleware(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const requestId = req.requestId;

  if (error instanceof DemandValidationError) {
    logger.warn('Validation error', {
      requestId,
      path: req.path,
      method: req.method,
      error: error.message,
      code: error.code,
      details: error.details,
    });
    res.status(400).json({
      message: error.message,
      code: error.code,
      details: error.details,
    });
    return;
  }

  if (error instanceof DemandConflictError) {
    logger.warn('Conflict error', {
      requestId,
      path: req.path,
      method: req.method,
      error: error.message,
      code: error.code,
      details: error.details,
    });
    res.status(409).json({
      message: error.message,
      code: error.code,
      details: error.details,
    });
    return;
  }

  if (error instanceof DemandError) {
    logger.warn('Demand error', {
      requestId,
      path: req.path,
      method: req.method,
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
    });
    res.status(error.statusCode).json({
      message: error.message,
      code: error.code,
      details: error.details,
    });
    return;
  }

  logger.error('Unexpected error', {
    requestId,
    path: req.path,
    method: req.method,
    error: error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name,
    } : error,
  });
  res.status(500).json({
    message: 'An unexpected error occurred',
    code: 'internal_error',
  });
}

