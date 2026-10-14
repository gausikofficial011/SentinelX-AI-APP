import { Pool } from 'pg';
import { env } from './env';
import { logger } from '../utils/logger';

/**
 * PostgreSQL connection pool.
 * PostGIS extension is loaded at database level (migrations).
 */
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  min: env.DB_POOL_MIN,
  max: env.DB_POOL_MAX,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  logger.error('Unexpected database error', { error: err.message });
});

pool.on('connect', () => {
  logger.debug('New database connection established');
});

/**
 * Check database health.
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const result = await pool.query('SELECT 1 as health');
    return result.rows[0].health === 1;
  } catch (error) {
    logger.error('Database health check failed', { error });
    return false;
  }
}

/**
 * Close database pool (for graceful shutdown).
 */
export async function closeDatabase(): Promise<void> {
  await pool.end();
  logger.info('Database pool closed');
}
