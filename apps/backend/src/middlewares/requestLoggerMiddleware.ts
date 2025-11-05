import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import logger from '../utils/logger';

declare global {
   namespace Express {
      interface Request {
         requestId?: string;
         startTime?: number;
      }
   }
}

export function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction): void {
   const requestId = randomUUID();
   req.requestId = requestId;
   req.startTime = Date.now();



   logger.info('Request received', {
      requestId,
      method: req.method,
      path: req.path,
      query: Object.keys(req.query).length > 0 ? req.query : undefined
   });

   res.on('finish', () => {
      const duration = req.startTime ? Date.now() - req.startTime : 0;

      logger.info('Request completed', {
         requestId,
         method: req.method,
         path: req.path,
         statusCode: res.statusCode,
         duration: `${duration}ms`
      });
   });

   next();
}

