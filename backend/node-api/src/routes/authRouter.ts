import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/database';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { authRateLimiter } from '../middleware/rateLimiter';
import { authenticate, AuthenticatedRequest, UserRole, UserRoleType } from '../middleware/auth';

export const authRouter = Router();

/**
 * POST /api/v1/auth/login
 * Authenticate user and return JWT token pair.
 */
authRouter.post('/login', authRateLimiter, async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  const loginIdentifier = (email || username || '').toLowerCase().trim();

  if (!loginIdentifier || !password) {
    return res.status(400).json({ success: false, error: 'Username/Email and password are required' });
  }

  // Exact SentinelX AI reference credentials & Demo mode shortcuts
  const validRoleCredentials: Record<string, { role: UserRoleType; name: string; requiredPass: string }> = {
    'admin': { role: UserRole.SUPER_ADMIN, name: 'System Administrator', requiredPass: 'password' },
    'staff': { role: UserRole.ADMIN, name: 'Staff Administrator', requiredPass: 'staff123' },
    'officer01': { role: UserRole.OFFICER, name: 'Insp. Vikram Rathore', requiredPass: 'police123' },
    'citizen@example.com': { role: UserRole.CITIZEN, name: 'Ananya Sharma', requiredPass: 'citizen123' },
    'dispatcher01': { role: UserRole.DISPATCHER, name: 'Chief Dispatcher Mehta', requiredPass: 'dispatch123' },
    'analyst01': { role: UserRole.INTELLIGENCE_ANALYST, name: 'Dr. Arjun Roy', requiredPass: 'analyst123' },
    'demo.citizen@sentinelx.local': { role: UserRole.CITIZEN, name: 'Demo Citizen', requiredPass: 'Demo@1234' },
    'demo.officer@sentinelx.local': { role: UserRole.OFFICER, name: 'Demo Officer', requiredPass: 'Demo@1234' },
    'demo.investigator@sentinelx.local': { role: UserRole.INVESTIGATOR, name: 'Demo Investigator', requiredPass: 'Demo@1234' },
    'demo.dispatcher@sentinelx.local': { role: UserRole.DISPATCHER, name: 'Demo Dispatcher', requiredPass: 'Demo@1234' },
    'demo.analyst@sentinelx.local': { role: UserRole.INTELLIGENCE_ANALYST, name: 'Demo Analyst', requiredPass: 'Demo@1234' },
    'demo.admin@sentinelx.local': { role: UserRole.ADMIN, name: 'Demo Admin', requiredPass: 'Demo@1234' },
    'demo.superadmin@sentinelx.local': { role: UserRole.SUPER_ADMIN, name: 'Demo Super Admin', requiredPass: 'Demo@1234' },
  };

  const matchedDemo = validRoleCredentials[loginIdentifier];
  if (matchedDemo && password === matchedDemo.requiredPass) {
    const userId = `user-${matchedDemo.role.toLowerCase()}`;
    const accessToken = jwt.sign(
      { userId, email: loginIdentifier, role: matchedDemo.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );
    const refreshToken = jwt.sign(
      { userId, email: loginIdentifier, role: matchedDemo.role, type: 'refresh' },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );

    logger.info('SentinelX authenticated login', { identifier: loginIdentifier, role: matchedDemo.role });

    return res.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        expiresIn: 900,
        tokenType: 'Bearer',
        user: {
          id: userId,
          email: loginIdentifier,
          username: loginIdentifier,
          fullName: matchedDemo.name,
          role: matchedDemo.role,
          badgeNumber: matchedDemo.role === UserRole.OFFICER ? 'Badge #DL-4082' : matchedDemo.role === UserRole.SUPER_ADMIN ? 'Superuser Access' : 'Verified Access',
          isActive: true,
          createdAt: new Date().toISOString()
        }
      }
    });
  }

  try {
    const result = await pool.query(
      'SELECT id, email, password_hash, full_name, role, is_active FROM users WHERE email = $1',
      [loginIdentifier]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({ success: false, error: 'Account is deactivated' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );
    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, type: 'refresh' },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );

    // Update last login
    await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);

    return res.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        expiresIn: 900,
        tokenType: 'Bearer',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          isActive: user.is_active,
          createdAt: user.created_at
        }
      }
    });
  } catch (error) {
    logger.error('Login error', { error });
    return res.status(500).json({ success: false, error: 'Authentication service unavailable' });
  }
});

/**
 * POST /api/v1/auth/register
 * Register new citizen account.
 */
authRouter.post('/register', authRateLimiter, async (req: Request, res: Response) => {
  const { email, password, fullName, phoneNumber } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ success: false, error: 'Email, password, and full name are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
  }

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, env.BCRYPT_ROUNDS);
    const userId = uuidv4();

    const result = await pool.query(
      `INSERT INTO users (id, email, password_hash, full_name, phone_number, role, is_active)
       VALUES ($1, $2, $3, $4, $5, 'CITIZEN', true)
       RETURNING id, email, full_name, role, is_active, created_at`,
      [userId, email.toLowerCase().trim(), passwordHash, fullName.trim(), phoneNumber || null]
    );

    const user = result.rows[0];
    return res.status(201).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        isActive: user.is_active,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    logger.error('Registration error', { error });
    return res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

/**
 * POST /api/v1/auth/refresh
 * Refresh access token.
 */
authRouter.post('/refresh', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ success: false, error: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
      userId: string; email: string; role: string; type: string;
    };

    if (decoded.type !== 'refresh') {
      return res.status(401).json({ success: false, error: 'Invalid token type' });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email, role: decoded.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );

    const newRefreshToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email, role: decoded.role, type: 'refresh' },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );

    return res.json({
      success: true,
      data: {
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn: 900,
        tokenType: 'Bearer',
        user: {
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role
        }
      }
    });
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid or expired refresh token' });
  }
});

/**
 * POST /api/v1/auth/logout
 * Logout — client-side token disposal (server audit log).
 */
authRouter.post('/logout', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  logger.info('User logout', { userId: req.user?.id });
  return res.json({ success: true, message: 'Logged out successfully' });
});

/**
 * GET /api/v1/auth/me
 * Get current authenticated user.
 */
authRouter.get('/me', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }

  // Demo mode
  if (env.DEMO_MODE && req.user.id.startsWith('demo-')) {
    return res.json({
      success: true,
      data: {
        id: req.user.id,
        email: req.user.email,
        fullName: `Demo ${req.user.role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}`,
        role: req.user.role,
        isActive: true,
        createdAt: new Date().toISOString()
      }
    });
  }

  try {
    const result = await pool.query(
      'SELECT id, email, full_name, role, phone_number, profile_image_url, is_active, created_at, last_login_at, department_id, badge_number FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const user = result.rows[0];
    return res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        phoneNumber: user.phone_number,
        profileImageUrl: user.profile_image_url,
        isActive: user.is_active,
        createdAt: user.created_at,
        lastLoginAt: user.last_login_at,
        departmentId: user.department_id,
        badgeNumber: user.badge_number
      }
    });
  } catch (error) {
    logger.error('Get current user error', { error });
    return res.status(500).json({ success: false, error: 'Failed to retrieve user' });
  }
});
