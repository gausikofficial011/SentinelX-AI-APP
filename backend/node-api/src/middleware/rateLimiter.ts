import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

/**
 * Rate limiter — protects all API endpoints.
 */
export const rateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests. Please try again later.',
    retryAfter: Math.ceil(env.RATE_LIMIT_WINDOW_MS / 1000)
  }
});

/**
 * Stricter limiter for auth endpoints.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again in 15 minutes.'
  }
});
