import { createClient } from 'redis';
import { env } from './env';
import { logger } from '../utils/logger';

/**
 * Redis client for caching, rate limiting, and realtime state.
 */
export const redisClient = createClient({
  url: env.REDIS_URL,
  password: env.REDIS_PASSWORD || undefined,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        logger.error('Redis max reconnection attempts reached');
        return new Error('Redis max retries');
      }
      return Math.min(retries * 100, 3000);
    }
  }
});

redisClient.on('error', (err) => {
  logger.error('Redis error', { error: err.message });
});

redisClient.on('connect', () => {
  logger.info('Redis connected');
});

redisClient.on('reconnecting', () => {
  logger.warn('Redis reconnecting...');
});

/**
 * Connect Redis client.
 */
export async function connectRedis(): Promise<void> {
  try {
    await redisClient.connect();
  } catch (error) {
    logger.error('Redis connection failed', { error });
    // Don't crash on Redis failure — graceful degradation
  }
}

/**
 * Check Redis health.
 */
export async function checkRedisHealth(): Promise<boolean> {
  try {
    const pong = await redisClient.ping();
    return pong === 'PONG';
  } catch {
    return false;
  }
}

/**
 * Helper: set with TTL.
 */
export async function cacheSet(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  try {
    await redisClient.set(`sentinelx:${key}`, JSON.stringify(value), { EX: ttlSeconds });
  } catch (error) {
    logger.warn('Cache set failed', { key, error });
  }
}

/**
 * Helper: get cached value.
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const value = await redisClient.get(`sentinelx:${key}`);
    return value ? JSON.parse(value) as T : null;
  } catch {
    return null;
  }
}

/**
 * Helper: delete cache key.
 */
export async function cacheDel(key: string): Promise<void> {
  try {
    await redisClient.del(`sentinelx:${key}`);
  } catch (error) {
    logger.warn('Cache delete failed', { key, error });
  }
}
