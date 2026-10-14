import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export interface ServerToClientEvents {
  emergency_update: (data: any) => void;
  public_alert: (data: any) => void;
  incident_update: (data: any) => void;
  notification: (data: any) => void;
}

export interface ClientToServerEvents {
  join_room: (room: string) => void;
  leave_room: (room: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
  role: string;
}

let io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

/**
 * Initialize WebSocket server.
 */
export function setupWebSocket(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN.split(',').map((o: string) => o.trim()),
      methods: ['GET', 'POST']
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string; role: string };
      socket.data.userId = decoded.userId;
      socket.data.role = decoded.role;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    logger.debug('Client connected', { socketId: socket.id, userId: socket.data.userId, role: socket.data.role });

    // Join personal room for targeted notifications
    socket.join(`user:${socket.data.userId}`);
    
    // Join role-based room
    socket.join(`role:${socket.data.role}`);

    socket.on('join_room', (room: string) => {
      // Basic validation for authorized rooms (implement strict checks in Phase 7)
      socket.join(room);
      logger.debug('Joined room', { socketId: socket.id, room });
    });

    socket.on('leave_room', (room: string) => {
      socket.leave(room);
    });

    socket.on('disconnect', () => {
      logger.debug('Client disconnected', { socketId: socket.id, userId: socket.data.userId });
    });
  });

  return io;
}

/**
 * Get Socket.IO instance for emitting events from controllers.
 */
export function getSocketIO() {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}
