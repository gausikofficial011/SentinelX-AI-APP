import { Router, Response } from 'express';
import { authenticate, AuthenticatedRequest, authorize, UserRole } from '../middleware/auth';
import { pool } from '../config/database';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env';
import { getSocketIO } from '../websocket/socketServer';

export const emergencyRouter = Router();
emergencyRouter.use(authenticate);

/**
 * POST /api/v1/emergency
 * Create new SOS emergency request.
 */
emergencyRouter.post('/', async (req: AuthenticatedRequest, res: Response) => {
  const { latitude, longitude, accuracy, description } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ success: false, error: 'Location coordinates required' });
  }

  if (env.DEMO_MODE) {
    const emergency = {
      id: uuidv4(),
      citizenId: req.user?.id,
      citizenName: 'Demo Citizen',
      location: { latitude, longitude, accuracy },
      status: 'CREATED',
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _demo: true
    };

    // Emit WebSocket event — Phase 7
    logger.info('Demo SOS emergency created', { emergency });
    getSocketIO().to('role:DISPATCHER').emit('emergency_update', emergency);
    return res.status(201).json({ success: true, data: emergency });
  }

  try {
    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO emergency_requests (id, citizen_id, latitude, longitude, location_accuracy, description, status)
       VALUES ($1, $2, ST_SetSRID(ST_MakePoint($4, $3), 4326), $4, $3, $5, $6, 'CREATED')
       RETURNING *`,
      [id, req.user?.id, latitude, longitude, accuracy || null, description || null, 'CREATED']
    );

    const newEmergency = result.rows[0];

    // Emit WebSocket event to dispatchers
    getSocketIO().to('role:DISPATCHER').emit('emergency_update', newEmergency);

    return res.status(201).json({ success: true, data: newEmergency });
  } catch (error) {
    logger.error('Create emergency error', { error });
    return res.status(500).json({ success: false, error: 'Failed to create emergency request' });
  }
});

/**
 * GET /api/v1/emergency/active
 * Get all active emergencies (Dispatcher/Officer only).
 */
emergencyRouter.get('/active', authorize(UserRole.DISPATCHER, UserRole.OFFICER, UserRole.ADMIN, UserRole.SUPER_ADMIN), async (req: AuthenticatedRequest, res: Response) => {
  if (env.DEMO_MODE) {
    return res.json({
      success: true,
      data: [{
        id: uuidv4(),
        citizenId: 'demo-citizen',
        citizenName: 'Demo Citizen',
        location: { latitude: 28.6139, longitude: 77.2090 },
        status: 'DISPATCHING',
        description: 'Demo SOS emergency',
        createdAt: new Date().toISOString(),
        _demo: true
      }]
    });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM emergency_requests WHERE status NOT IN ('RESOLVED', 'CANCELLED') ORDER BY created_at DESC"
    );
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch emergencies' });
  }
});

/**
 * GET /api/v1/emergency/:id
 */
emergencyRouter.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  if (env.DEMO_MODE) {
    return res.json({ success: true, data: { id: req.params.id, status: 'CREATED', _demo: true } });
  }

  try {
    const result = await pool.query('SELECT * FROM emergency_requests WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Emergency not found' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch emergency' });
  }
});

/**
 * PATCH /api/v1/emergency/:id/status
 * Update emergency status (Dispatcher only).
 */
emergencyRouter.patch('/:id/status', authorize(UserRole.DISPATCHER, UserRole.ADMIN, UserRole.SUPER_ADMIN), async (req: AuthenticatedRequest, res: Response) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, error: 'Status required' });
  }

  if (env.DEMO_MODE) {
    return res.json({ success: true, data: { id: req.params.id, status, updatedAt: new Date().toISOString() } });
  }

  try {
    const result = await pool.query(
      'UPDATE emergency_requests SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Emergency not found' });
    }

    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to update emergency status' });
  }
});
