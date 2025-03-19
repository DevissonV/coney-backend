import app from '../../src/server.js';
import request from 'supertest';

describe('Payments API', () => {
  it('should return 200 for GET /payments', async () => {
    const response = await request(app).get('/payments/');
    expect(response.status).toBe(200);
  });

  it('should return 404 for non-existing route', async () => {
    const response = await request(app).get('/non-existing-route');
    expect(response.status).toBe(404);
  });
});
