import app from '../../src/server.js';
import request from 'supertest';
import { registerAndLoginUser } from '../factories/auth-factory.js';

describe('Raffles API', () => {
  let token;
  let createdRaffleId;

  beforeAll(async () => {
    token = await registerAndLoginUser();
  });

  it('should create a new raffle', async () => {
    const raffleData = {
      name: 'Test Raffle',
      description: 'This is a test raffle',
      initDate: '2025-02-01T00:00:00.000Z',
      endDate: '2025-03-01T00:00:00.000Z',
    };

    const response = await request(app)
      .post('/api/raffles/')
      .set('Authorization', `Bearer ${token}`)
      .send(raffleData);

    expect(response.status).toBe(201);
    expect(response.body.data[0]).toHaveProperty('name', raffleData.name);
    createdRaffleId = response.body.data[0].id;
  });

  it('should get all raffles', async () => {
    const response = await request(app)
      .get('/api/raffles/')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should get a single raffle by ID', async () => {
    const response = await request(app)
      .get(`/api/raffles/${createdRaffleId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('id', createdRaffleId);
  });

  it('should delete a raffle', async () => {
    const response = await request(app)
      .delete(`/api/raffles/${createdRaffleId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', true);
  });
});
