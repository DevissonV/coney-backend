import app from '../../src/server.js';
import request from 'supertest';

describe('Raffles API', () => {
  it('should return 200 for GET /raffles', async () => {
    const response = await request(app).get('/raffles/');
    expect(response.status).toBe(200);
  });

  it('should return 404 for non-existing route', async () => {
    const response = await request(app).get('/non-existing-route');
    expect(response.status).toBe(404);
  });
});