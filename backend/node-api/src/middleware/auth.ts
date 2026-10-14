import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * JWT authentication middleware.
 * Verifies the Bearer token in Authorization header.
 */
export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Authorization token required' });
    return;
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };

    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ success: false, error: 'Token expired' });
    } else {
      res.status(401).json({ success: false, error: 'Invalid token' });
    }
  }
}

/**
 * Role-based authorization middleware factory.
 */
export function authorize(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn('Authorization denied', {
        userId: req.user.id,
        role: req.user.role,
        requiredRoles: allowedRoles,
        url: req.url
      });
      res.status(403).json({
        success: false,
        error: `Access denied. Required role: ${allowedRoles.join(' or ')}`
      });
      return;
    }

    next();
  };
}

/**
 * User roles enum.
 */
export const UserRole = {
  CITIZEN: 'CITIZEN',
  OFFICER: 'OFFICER',
  INVESTIGATOR: 'INVESTIGATOR',
  DISPATCHER: 'DISPATCHER',
  INTELLIGENCE_ANALYST: 'INTELLIGENCE_ANALYST',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN'
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];
