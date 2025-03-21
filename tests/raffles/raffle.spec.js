import app from '../../src/server.js';
import request from 'supertest';
import { registerAndLoginUser } from '../factories/auth-factory.js';
import dayjs from 'dayjs';

describe('Raffles API', () => {
  let token;
  let userId;
  let createdRaffleId;

  const today = dayjs().add(1, 'day').toISOString();
  const futureDate = dayjs().add(30, 'day').toISOString();

  beforeAll(async () => {
    const result = await registerAndLoginUser();
    token = result.token;
    userId = result.userId;
  });

  afterAll(async () => {
    if (userId) {
      await request(app)
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);
    }
  });

  it('should create a new raffle', async () => {
    const raffleData = {
      name: 'Test Raffle',
      description: 'This is a test raffle',
      initDate: today,
      endDate: futureDate,
      price: 15000,
      ticketCount: 10,
    };

    const response = await request(app)
      .post('/api/raffles/')
      .set('Authorization', `Bearer ${token}`)
      .send(raffleData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('id');

    createdRaffleId = response.body.data.id;
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

  it('should update a raffle', async () => {
    const updatedInitDate = dayjs().add(5, 'day').toISOString();
    const updatedEndDate = dayjs().add(35, 'day').toISOString();

    const updatedData = {
      name: 'Updated Test Raffle',
      description: 'Updated description',
      initDate: updatedInitDate,
      endDate: updatedEndDate,
      price: 20000,
    };

    const response = await request(app)
      .patch(`/api/raffles/${createdRaffleId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);

    expect(response.status).toBe(200);
  });

  it('should delete a raffle', async () => {
    const response = await request(app)
      .delete(`/api/raffles/${createdRaffleId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', true);
  });
});
