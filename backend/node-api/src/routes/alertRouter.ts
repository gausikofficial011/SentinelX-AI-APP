import { Router, Response } from 'express';
import { authenticate, AuthenticatedRequest, authorize, UserRole } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env';
import { getSocketIO } from '../websocket/socketServer';

export const alertRouter = Router();

/**
 * GET /api/v1/alerts — Public alerts (no auth required for read).
 */
alertRouter.get('/', async (req, res) => {
  if (env.DEMO_MODE) {
    return res.json({
      success: true,
      data: {
        data: [
          { id: uuidv4(), title: 'Traffic Advisory', message: 'Highway 12 closed for maintenance.', severity: 'WARNING', area: 'District 4', isActive: true, createdAt: new Date().toISOString(), _demo: true },
          { id: uuidv4(), title: 'Weather Alert', message: 'Heavy rainfall warning for coastal areas.', severity: 'CRITICAL', area: 'Coastal Zone', isActive: true, createdAt: new Date().toISOString(), _demo: true },
          { id: uuidv4(), title: 'Public Safety Notice', message: 'Increased patrols in downtown. Please cooperate.', severity: 'INFO', area: 'Downtown', isActive: true, createdAt: new Date().toISOString(), _demo: true }
        ],
        total: 3
      }
    });
  }
  return res.json({ success: true, data: { data: [], total: 0 } });
});

alertRouter.get('/:id', async (req, res) => {
  return res.json({ success: true, data: { id: req.params.id, _demo: env.DEMO_MODE } });
});


alertRouter.post('/', authenticate, authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), async (req: AuthenticatedRequest, res: Response) => {
  if (env.DEMO_MODE) {
    const alert = { ...req.body, id: uuidv4(), isActive: true, createdAt: new Date().toISOString() };
    getSocketIO().emit('public_alert', alert); // Broadcast to everyone
    return res.status(201).json({ success: true, data: alert });
  }
  const alert = { id: uuidv4(), ...req.body };
  getSocketIO().emit('public_alert', alert);
  return res.status(201).json({ success: true, data: alert });
});

export const firRouter = Router();
firRouter.use(authenticate);

firRouter.get('/', async (req: AuthenticatedRequest, res: Response) => {
  if (env.DEMO_MODE) {
    return res.json({ success: true, data: { data: [], total: 0 } });
  }
  return res.json({ success: true, data: { data: [], total: 0 } });
});

firRouter.post('/', authorize(UserRole.OFFICER, UserRole.ADMIN, UserRole.SUPER_ADMIN), async (req: AuthenticatedRequest, res: Response) => {
  if (env.DEMO_MODE) {
    return res.status(201).json({ success: true, data: { ...req.body, id: uuidv4(), firNumber: `FIR-2024-${Math.floor(Math.random() * 9000) + 1000}` } });
  }
  return res.status(201).json({ success: true, data: { id: uuidv4() } });
});

export const caseRouter = Router();
caseRouter.use(authenticate);

caseRouter.get('/', async (req: AuthenticatedRequest, res: Response) => {
  if (env.DEMO_MODE) {
    return res.json({ success: true, data: { data: [], total: 0 } });
  }
  return res.json({ success: true, data: { data: [], total: 0 } });
});

caseRouter.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  if (env.DEMO_MODE) {
    return res.json({ success: true, data: { id: req.params.id, _demo: true } });
  }
  return res.json({ success: true, data: { id: req.params.id } });
});

export const notificationRouter = Router();
notificationRouter.use(authenticate);

notificationRouter.get('/', async (req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: { data: [], total: 0, unreadCount: 0 } });
});

notificationRouter.patch('/:id/read', async (req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, message: 'Notification marked as read' });
});

notificationRouter.patch('/mark-all-read', async (req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, message: 'All notifications marked as read' });
});
