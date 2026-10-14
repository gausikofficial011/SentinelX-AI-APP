import { z } from 'zod';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

/**
 * Environment configuration with validation.
 * All required variables must be present — fail fast on missing config.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  NODE_PORT: z.coerce.number().default(3000),

  DATABASE_URL: z.string().min(1),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_NAME: z.string().default('sentinelx'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default(''),
  DB_POOL_MIN: z.coerce.number().default(2),
  DB_POOL_MAX: z.coerce.number().default(10),

  REDIS_URL: z.string().default('redis://localhost:6379'),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),

  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  AI_ENGINE_URL: z.string().default('http://localhost:8000'),
  AI_ENGINE_API_KEY: z.string().optional(),

  STORAGE_TYPE: z.enum(['local', 's3', 'minio']).default('local'),
  STORAGE_LOCAL_PATH: z.string().default('./storage/uploads'),

  CORS_ORIGIN: z.string().default('http://localhost:3000'),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),

  BCRYPT_ROUNDS: z.coerce.number().default(12),

  LOG_LEVEL: z.string().default('info'),

  SESSION_TIMEOUT_MINUTES: z.coerce.number().default(30),

  DEMO_MODE: z.string().transform((v: string) => v === 'true').default(true),
  DEMO_DATA_LABEL: z.string().default('SYNTHETIC_DEMO_DATA'),
});

type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment configuration:');
    console.error(result.error.format());
    // In production, throw. In development, use defaults with warnings.
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    // For development: fall back to defaults
    return envSchema.parse({
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/sentinelx',
      JWT_SECRET: process.env.JWT_SECRET || 'development_jwt_secret_not_for_production_32chars',
      JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'development_refresh_secret_not_for_production_32ch',
    });
  }
  return result.data;
}

export const env = validateEnv();
