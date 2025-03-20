import { jest } from '@jest/globals';
import request from 'supertest';
import dayjs from 'dayjs';
import app from '../../src/server.js';
import { registerAndLoginUser } from '../factories/auth-factory.js';
import paymentRepository from '../../src/features/payments/repositories/payment-repository.js';
import { paymentExternalService } from '../../src/features/payments/services/payment-dependencies.js';

async function createTestRaffle(token) {
  const raffleData = {
    name: 'Test Raffle for Payments',
    description: 'Raffle for testing payments',
    initDate: dayjs().add(1, 'day').toISOString(),
    endDate: dayjs().add(30, 'day').toISOString(),
    price: 15000,
    ticketCount: 10,
  };

  const res = await request(app)
    .post('/api/raffles/')
    .set('Authorization', `Bearer ${token}`)
    .send(raffleData);

  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty('data');
  return res.body.data;
}

describe('Payments API - Happy Path', () => {
  let token, userId, createdRaffleId, createdPaymentId;

  const paymentData = {
    amount: 50000,
    tickets: [1, 2, 3, 4, 5],
  };

  beforeAll(async () => {
    const auth = await registerAndLoginUser();
    token = auth.token;
    userId = auth.userId;

    const raffle = await createTestRaffle(token);
    createdRaffleId = raffle.id;
    paymentData.raffleId = createdRaffleId;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    if (createdRaffleId) {
      await request(app)
        .delete(`/api/raffles/${createdRaffleId}`)
        .set('Authorization', `Bearer ${token}`);
    }
    if (userId) {
      await request(app)
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);
    }
  });

  it('should create a new payment (integrating external session creation)', async () => {
    const res = await request(app)
      .post('/api/payments/')
      .set('Authorization', `Bearer ${token}`)
      .send(paymentData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('raffle_id', createdRaffleId);

    createdPaymentId = res.body.data.id;
  });

  it('should get all payments', async () => {
    const res = await request(app)
      .get('/api/payments/')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
  });

  it('should get a payment by ID', async () => {
    const res = await request(app)
      .get(`/api/payments/${createdPaymentId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('id', createdPaymentId);
  });

  it('should update a payment', async () => {
    const updatedData = {
      status: 'completed',
    };

    const res = await request(app)
      .patch(`/api/payments/${createdPaymentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('status', updatedData.status);
  });

  it('should delete a payment', async () => {
    const res = await request(app)
      .delete(`/api/payments/${createdPaymentId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it('should return 200 when payment is successful', async () => {
    const res = await request(app)
      .get('/api/payments/success')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Payment successfully');
  });

  it('should return 200 when payment is cancelled', async () => {
    const res = await request(app)
      .get('/api/payments/cancel')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Payment cancelled');
  });
});

describe('Payments API - Error Scenarios', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  let token, createdRaffleId;

  beforeAll(async () => {
    const auth = await registerAndLoginUser();
    token = auth.token;
    const raffle = await createTestRaffle(token);
    createdRaffleId = raffle.id;
  });

  afterAll(async () => {
    if (createdRaffleId) {
      await request(app)
        .delete(`/api/raffles/${createdRaffleId}`)
        .set('Authorization', `Bearer ${token}`);
    }
  });

  it('should return 500 when getAll fails', async () => {
    jest
      .spyOn(paymentRepository, 'getAll')
      .mockRejectedValue(new Error('Test error getAll'));

    const res = await request(app)
      .get('/api/payments/?limit=3&page=1')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(500);
  });

  it('should return 500 when a generic error occurs on create', async () => {
    jest
      .spyOn(paymentExternalService, 'createSession')
      .mockRejectedValue(new Error('Generic create error'));
    const res = await request(app)
      .post('/api/payments/')
      .set('Authorization', `Bearer ${token}`)
      .send({
        raffleId: createdRaffleId,
        amount: 10000,
        tickets: [1, 2, 3],
        currency: 'COP',
      });
    expect(res.status).toBe(500);
  });

  it('should return 500 when delete fails due to getById error', async () => {
    jest
      .spyOn(paymentRepository, 'getById')
      .mockRejectedValue(new Error('Internal Server Error'));
    const res = await request(app)
      .delete('/api/payments/999999999999')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(500);
  });

  it('should return 404 when delete fails due to getById not found', async () => {
    jest.spyOn(paymentRepository, 'getById').mockResolvedValue(null);
    const res = await request(app)
      .delete('/api/payments/999999999999')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it('should return 500 when delete fails due to repository.delete error', async () => {
    jest.spyOn(paymentRepository, 'getById').mockResolvedValue({ id: 123 });
    jest
      .spyOn(paymentRepository, 'delete')
      .mockRejectedValue(new Error('Delete error'));
    const res = await request(app)
      .delete('/api/payments/123')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(500);
  });

  it('should return 400 when creating a payment with invalid amount', async () => {
    const res = await request(app)
      .post('/api/payments/')
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: -5000,
        tickets: [1, 2],
        raffleId: createdRaffleId,
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Amount must be a positive number');
  });

  it('should return 400 when creating a payment without required fields', async () => {
    const res = await request(app)
      .post('/api/payments/')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Amount is required');
  });

  it('should return 500 when getById fails in update', async () => {
    jest
      .spyOn(paymentRepository, 'getById')
      .mockRejectedValue(new Error('Database failure'));

    const res = await request(app)
      .patch(`/api/payments/${createdRaffleId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'completed' });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Database failure');
  });

  it('should return 400 when search criteria validation fails for limit', async () => {
    const res = await request(app)
      .get('/api/payments/?limit=-1&page=1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toContain(
      '"limit" must be greater than or equal to 1',
    );
  });

  it('should return 400 when search criteria validation fails for page', async () => {
    const res = await request(app)
      .get('/api/payments/?limit=1&page=abc')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('"page" must be a number');
  });

  it('should return 400 when creating a payment with invalid ticket IDs', async () => {
    const res = await request(app)
      .post('/api/payments/')
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 10000,
        tickets: ['invalid-ticket'],
        raffleId: createdRaffleId,
        stripeSessionId: 'session_123',
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('tickets[0]\" must be a number');
  });
});
