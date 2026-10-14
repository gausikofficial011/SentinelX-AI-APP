import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Global error handler middleware.
 * Must be last middleware in the chain.
 */
export function errorHandler(
  err: Error & { status?: number; statusCode?: number },
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error('Request error', {
    method: req.method,
    url: req.url,
    status,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}
