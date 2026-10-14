import { Router, Request, Response } from 'express';
import { pool } from '../config/database';
import { authenticate, authorize, UserRole, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

/**
 * GET /api/v1/users
 * Returns a list of all users in the system.
 * Accessible by ADMIN and SUPER_ADMIN.
 */
router.get('/', authenticate, authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), async (req: AuthenticatedRequest, res: Response) => {
    try {
        const query = `
            SELECT id, email, full_name, role, phone_number, is_active, created_at, updated_at
            FROM users
            ORDER BY created_at DESC
        `;
        const result = await pool.query(query);
        
        // Convert to DTO format
        const users = result.rows.map((row: any) => ({
            id: row.id,
            email: row.email,
            full_name: row.full_name,
            role: row.role,
            phone_number: row.phone_number,
            is_active: row.is_active,
            created_at: row.created_at,
            updated_at: row.updated_at
        }));

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch users' });
    }
});

export default router;
