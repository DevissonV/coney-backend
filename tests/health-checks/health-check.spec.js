import request from 'supertest';
import app from '../../src/server.js';

describe('Health Check API', () => {
  it('should return successful mock data on /test-response-success', async () => {
    const response = await request(app).get(
      '/api/health-checks/test-response-success',
    );
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', true);
    expect(response.body).toHaveProperty('code', 200);
  });

  it('should return error response on /test-response-error', async () => {
    const response = await request(app).get(
      '/api/health-checks/test-response-error',
    );
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('status', false);
    expect(response.body).toHaveProperty('code', 400);
  });
});
