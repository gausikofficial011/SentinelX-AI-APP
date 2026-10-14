import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { createServer } from 'http';

import { env } from './config/env';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { healthRouter } from './health/healthRouter';
import { authRouter } from './routes/authRouter';
import { incidentRouter } from './routes/incidentRouter';
import { emergencyRouter } from './routes/emergencyRouter';
import { alertRouter, firRouter, caseRouter, notificationRouter } from './routes/alertRouter';
import userRouter from './routes/userRouter';
import { setupWebSocket } from './websocket/socketServer';

const app = express();
const httpServer = createServer(app);

// =============================================================
// MIDDLEWARE
// =============================================================

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(cors({
  origin: env.CORS_ORIGIN.split(',').map((o: string) => o.trim()),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-App-Version', 'X-Platform']
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// =============================================================
// RATE LIMITING
// =============================================================

app.use('/api/', rateLimiter);

// =============================================================
// ROUTES
// =============================================================

// Health endpoints (no auth required)
app.use('/', healthRouter);
app.use('/api', healthRouter);

// API v1
const apiV1 = '/api/v1';
app.use(`${apiV1}/auth`, authRouter);
app.use(`${apiV1}/incidents`, incidentRouter);
app.use(`${apiV1}/emergency`, emergencyRouter);
app.use(`${apiV1}/alerts`, alertRouter);
app.use(`${apiV1}/firs`, firRouter);
app.use(`${apiV1}/cases`, caseRouter);
app.use(`${apiV1}/notifications`, notificationRouter);
app.use(`${apiV1}/users`, userRouter);

// API Docs placeholder
app.get('/api-docs', (req, res) => {
  res.json({
    message: 'SentinelX API Documentation',
    version: '1.0.0',
    note: 'Full Swagger docs will be added in Phase 3',
    endpoints: {
      health: 'GET /health',
      auth: `${apiV1}/auth`,
      incidents: `${apiV1}/incidents`,
      emergency: `${apiV1}/emergency`,
      alerts: `${apiV1}/alerts`,
      firs: `${apiV1}/firs`,
      cases: `${apiV1}/cases`
    }
  });
});

// =============================================================
// ERROR HANDLER (must be last)
// =============================================================

app.use(errorHandler);

// =============================================================
// WEBSOCKET
// =============================================================

setupWebSocket(httpServer);

// =============================================================
// START SERVER
// =============================================================

const PORT = env.NODE_PORT || 3000;

if (env.NODE_ENV !== 'test') {
  httpServer.listen(PORT, '0.0.0.0', () => {
    logger.info(`🛡️  SentinelX Node API running on port ${PORT} (0.0.0.0)`);
    logger.info(`📌 Environment: ${env.NODE_ENV}`);
    logger.info(`🏥 Health: http://localhost:${PORT}/health`);
    logger.info(`📖 API Docs: http://localhost:${PORT}/api-docs`);
    if (env.DEMO_MODE) {
      logger.warn('⚠️  DEMO MODE ENABLED — Using synthetic data');
    }
  });
}

export { app, httpServer };
