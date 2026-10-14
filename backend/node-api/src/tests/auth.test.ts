import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import { app } from '../server';

describe('Auth Endpoints', () => {
    it('should return 400 Bad Request if email or password are missing', async () => {
        const response = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'test@example.com' }); // missing password
            
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Email and password are required');
    });

    it('should return 401 Unauthorized for invalid credentials', async () => {
        const response = await request(app)
            .post('/api/v1/auth/login')
            .send({ 
                email: 'invalid@sentinelx.local', 
                password: 'wrongpassword' 
            });
            
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Invalid credentials');
    });

    it('should enforce rate limiting on auth endpoints', async () => {
        // This relies on the memory rate limiter configuration, 
        // which allows 10 requests per 15 minutes.
        // We will fire 11 quick requests to hit the limit.
        for (let i = 0; i < 10; i++) {
            await request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'test@sentinelx.local', password: 'password' });
        }

        const limitResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'test@sentinelx.local', password: 'password' });

        expect(limitResponse.status).toBe(429);
        expect(limitResponse.body.success).toBe(false);
        expect(limitResponse.body.error).toContain('Too many authentication attempts');
    });
});
