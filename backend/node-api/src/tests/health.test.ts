import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import { app } from '../server';

describe('Health Endpoints', () => {
    it('should return 200 OK and health status for GET /health', async () => {
        const response = await request(app).get('/health');
        
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('UP');
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body).toHaveProperty('uptime');
    });

    it('should return 200 OK and health status for GET /api/health', async () => {
        const response = await request(app).get('/api/health');
        
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('UP');
    });
});
