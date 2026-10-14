import { Router, Response } from 'express';
import { authenticate, AuthenticatedRequest, authorize, UserRole } from '../middleware/auth';
import { pool } from '../config/database';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env';
import { getSocketIO } from '../websocket/socketServer';

export const incidentRouter = Router();
incidentRouter.use(authenticate);

/**
 * GET /api/v1/incidents
 * Get paginated incidents (role-filtered).
 */
incidentRouter.get('/', async (req: AuthenticatedRequest, res: Response) => {
  if (env.DEMO_MODE) {
    return res.json({
      success: true,
      data: {
        data: generateDemoIncidents(10),
        total: 10, page: 0, size: 20, hasMore: false
      }
    });
  }

  try {
    const { page = 0, size = 20, status } = req.query;
    const offset = Number(page) * Number(size);

    let query = 'SELECT * FROM incidents';
    const params: unknown[] = [];
    let paramIdx = 1;

    // Role-based filtering
    if (req.user?.role === UserRole.CITIZEN) {
      query += ` WHERE reported_by_id = $${paramIdx++}`;
      params.push(req.user.id);
    } else if (req.user?.role === UserRole.OFFICER) {
      query += ` WHERE (assigned_officer_id = $${paramIdx++} OR station_id IN (SELECT station_id FROM officers WHERE user_id = $${paramIdx++}))`;
      params.push(req.user.id, req.user.id);
    }

    if (status) {
      const connector = params.length > 0 ? ' AND' : ' WHERE';
      query += `${connector} status = $${paramIdx++}`;
      params.push(status);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`;
    params.push(size, offset);

    const result = await pool.query(query, params);
    const countResult = await pool.query('SELECT COUNT(*) FROM incidents', []);

    return res.json({
      success: true,
      data: {
        data: result.rows,
        total: parseInt(countResult.rows[0].count),
        page: Number(page),
        size: Number(size),
        hasMore: (Number(page) + 1) * Number(size) < parseInt(countResult.rows[0].count)
      }
    });
  } catch (error) {
    logger.error('Get incidents error', { error });
    return res.status(500).json({ success: false, error: 'Failed to fetch incidents' });
  }
});

/**
 * GET /api/v1/incidents/:id
 */
incidentRouter.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  if (env.DEMO_MODE) {
    const demo = generateDemoIncidents(1)[0];
    return res.json({ success: true, data: { ...demo, id: req.params.id } });
  }

  try {
    const result = await pool.query('SELECT * FROM incidents WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Incident not found' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch incident' });
  }
});

/**
 * POST /api/v1/incidents
 */
incidentRouter.post('/', async (req: AuthenticatedRequest, res: Response) => {
  if (env.DEMO_MODE) {
    const incident = { ...req.body, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    getSocketIO().to('role:DISPATCHER').to('role:OFFICER').emit('incident_update', incident);
    return res.status(201).json({ success: true, data: incident });
  }

  try {
    const { title, description, incidentType, location, severity } = req.body;
    const id = uuidv4();

    const result = await pool.query(
      `INSERT INTO incidents (id, title, description, incident_type, latitude, longitude, severity, status, reported_by_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'REPORTED', $8)
       RETURNING *`,
      [id, title, description, incidentType, location?.latitude, location?.longitude, severity || 'MEDIUM', req.user?.id]
    );

    const newIncident = result.rows[0];
    getSocketIO().to('role:DISPATCHER').to('role:OFFICER').emit('incident_update', newIncident);

    return res.status(201).json({ success: true, data: newIncident });
  } catch (error) {
    logger.error('Create incident error', { error });
    return res.status(500).json({ success: false, error: 'Failed to create incident' });
  }
});

/**
 * PATCH /api/v1/incidents/:id
 */
incidentRouter.patch('/:id', authorize(UserRole.OFFICER, UserRole.DISPATCHER, UserRole.ADMIN, UserRole.SUPER_ADMIN), async (req: AuthenticatedRequest, res: Response) => {
  if (env.DEMO_MODE) {
    return res.json({ success: true, data: { ...req.body, id: req.params.id, updatedAt: new Date().toISOString() } });
  }
  return res.json({ success: true, data: { id: req.params.id, ...req.body } });
});

function generateDemoIncidents(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: uuidv4(),
    title: `Demo Incident ${i + 1}`,
    description: `Synthetic demo incident number ${i + 1}. DEMO DATA — Not a real incident.`,
    incidentType: ['THEFT', 'ASSAULT', 'VANDALISM', 'ROBBERY', 'MISSING_PERSON'][i % 5],
    location: { latitude: 28.6139 + (Math.random() - 0.5) * 0.1, longitude: 77.2090 + (Math.random() - 0.5) * 0.1 },
    status: ['REPORTED', 'UNDER_INVESTIGATION', 'RESOLVED'][i % 3],
    severity: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][i % 4],
    reportedById: 'demo-citizen',
    createdAt: new Date(Date.now() - i * 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
    _demo: true
  }));
}
