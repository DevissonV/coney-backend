import { jest } from '@jest/globals';
import request from 'supertest';
import dayjs from 'dayjs';
import app from '../../src/server.js';
import { registerAndLoginUser } from '../factories/auth-factory.js';
import { PaymentMother } from './mother/payment-mother.js';
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
  return res.body.data;
}

describe('Payments API - Integration', () => {
  let token, userId, createdRaffleId, createdPaymentId;

  beforeAll(async () => {
    const auth = await registerAndLoginUser();
    token = auth.token;
    userId = auth.userId;

    const raffle = await createTestRaffle(token);
    createdRaffleId = raffle.id;
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

  it('should create a new payment', async () => {
    const paymentData = PaymentMother.validCreateDTO({
      raffleId: createdRaffleId,
    });
    const res = await request(app)
      .post('/api/payments/')
      .set('Authorization', `Bearer ${token}`)
      .send(paymentData);

    expect(res.status).toBe(201);
    createdPaymentId = res.body.data.id;
  });

  it('should get all payments', async () => {
    const res = await request(app)
      .get('/api/payments/')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it('should get a payment by ID', async () => {
    const res = await request(app)
      .get(`/api/payments/${createdPaymentId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(createdPaymentId);
  });

  it('should update a payment', async () => {
    const res = await request(app)
      .patch(`/api/payments/${createdPaymentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'completed' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('completed');
  });

  it('should delete a payment', async () => {
    const res = await request(app)
      .delete(`/api/payments/${createdPaymentId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it('should return 200 on success callback', async () => {
    const res = await request(app)
      .get('/api/payments/success')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Payment successfully');
  });

  it('should return 200 on cancel callback', async () => {
    const res = await request(app)
      .get('/api/payments/cancel')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Payment cancelled');
  });
});
