import { Router, Request, Response } from 'express';
import { checkDatabaseHealth } from '../config/database';
import { checkRedisHealth } from '../config/redis';
import { env } from '../config/env';

/**
 * Health check endpoints.
 * Required for admin monitoring and deployment readiness.
 */
export const healthRouter = Router();

healthRouter.get('/health', async (req: Request, res: Response) => {
  const dbHealthy = await checkDatabaseHealth().catch(() => false);
  const redisHealthy = await checkRedisHealth().catch(() => false);

  const status = (dbHealthy || env.DEMO_MODE) ? 'healthy' : 'degraded';
  const httpStatus = 200;

  res.status(httpStatus).json({
    status,
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    demoMode: env.DEMO_MODE,
    services: {
      database: dbHealthy ? 'up' : (env.DEMO_MODE ? 'demo_mock' : 'down'),
      redis: redisHealthy ? 'up' : (env.DEMO_MODE ? 'demo_mock' : 'down'),
    }
  });
});

healthRouter.get('/api/health', async (req: Request, res: Response) => {
  res.redirect('/health');
});
