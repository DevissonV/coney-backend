import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../src/server.js';
import { registerAndLoginUser } from '../factories/auth-factory.js';
import dayjs from 'dayjs';
import winnerRepository from '../../src/features/winners/repositories/winner-repository.js';
import { winnerLogicService } from '../../src/features/winners/services/winner-dependencies.js';

const today = dayjs().add(1, 'day').toISOString();
const futureDate = dayjs().add(30, 'day').toISOString();

/**
 * Crea una rifa de prueba y retorna los datos creados.
 * @param {string} token - Token de autenticación.
 * @returns {Promise<Object>}
 */
async function createTestRaffle(token) {
  const raffleData = {
    name: 'Test Raffle for Winners',
    description: 'Raffle for testing winners',
    initDate: today,
    endDate: futureDate,
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

/**
 * Reserva el primer ticket disponible de la rifa asignándole el userId.
 * @param {string} token - Token de autenticación.
 * @param {number} raffleId - ID de la rifa.
 * @param {number} userId - ID del usuario a asignar.
 * @returns {Promise<Object>}
 */
async function reserveFirstTicket(token, raffleId, userId) {
  const resTickets = await request(app)
    .get(`/api/tickets/?raffle_id=${raffleId}&limit=1&page=1`)
    .set('Authorization', `Bearer ${token}`);
  expect(resTickets.status).toBe(200);
  expect(resTickets.body.data.length).toBeGreaterThan(0);

  const ticket = resTickets.body.data[0];
  const resUpdate = await request(app)
    .patch(`/api/tickets/${ticket.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      ticketNumber: ticket.ticket_number,
      raffleId: raffleId,
      userId: userId,
    });
  expect(resUpdate.status).toBe(200);
  return resUpdate.body.data;
}

describe('Winners API - Happy Path', () => {
  let token, userId, createdRaffleId, winnerId;

  beforeAll(async () => {
    const auth = await registerAndLoginUser();
    token = auth.token;
    userId = auth.userId;

    const raffle = await createTestRaffle(token);
    createdRaffleId = raffle.id;

    await reserveFirstTicket(token, createdRaffleId, userId);
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

  it('should return an empty winners list initially', async () => {
    const res = await request(app)
      .get('/api/winners/?limit=3&page=1')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should create a winner for the raffle', async () => {
    const res = await request(app)
      .post('/api/winners')
      .set('Authorization', `Bearer ${token}`)
      .send({ raffle_id: createdRaffleId });
    expect(res.status).toBeLessThan(300);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('raffle_id', createdRaffleId);
    winnerId = res.body.data.id;
  });

  it('should not create a winner if one already exists', async () => {
    const res = await request(app)
      .post('/api/winners')
      .set('Authorization', `Bearer ${token}`)
      .send({ raffle_id: createdRaffleId });
    expect(res.status).toBe(400);
  });

  it('should get a winner by ID', async () => {
    const res = await request(app)
      .get(`/api/winners/${winnerId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('id', winnerId);
  });

  it('should delete the created winner', async () => {
    const resDel = await request(app)
      .delete(`/api/winners/${winnerId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(resDel.status).toBe(200);
    const resGet = await request(app)
      .get(`/api/winners/${winnerId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(resGet.status).toBe(404);
  });
});

describe('Winners API - Error Scenarios', () => {
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
      .spyOn(winnerRepository, 'getAll')
      .mockRejectedValue(new Error('Test error getAll'));
    const res = await request(app)
      .get('/api/winners/?limit=3&page=1')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(500);
  });

  it('should return 400 when duplicate error occurs on create', async () => {
    const duplicateError = Object.assign(new Error('Duplicate error'), {
      code: '23505',
    });
    jest
      .spyOn(winnerLogicService, 'createWinner')
      .mockRejectedValue(duplicateError);
    const res = await request(app)
      .post('/api/winners')
      .set('Authorization', `Bearer ${token}`)
      .send({ raffle_id: createdRaffleId });
    expect(res.status).toBe(400);
  });

  it('should return 500 when a generic error occurs on create', async () => {
    jest
      .spyOn(winnerLogicService, 'createWinner')
      .mockRejectedValue(new Error('Generic create error'));
    const res = await request(app)
      .post('/api/winners')
      .set('Authorization', `Bearer ${token}`)
      .send({ raffle_id: createdRaffleId });
    expect(res.status).toBe(500);
  });

  it('should return 500 when delete fails due to getById error', async () => {
    jest
      .spyOn(winnerRepository, 'getById')
      .mockRejectedValue(new Error('Not found error'));
    const res = await request(app)
      .delete('/api/winners/99999')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(500);
  });

  it('should return 500 when delete fails due to repository.delete error', async () => {
    jest.spyOn(winnerRepository, 'getById').mockResolvedValue({ id: 123 });
    jest
      .spyOn(winnerRepository, 'delete')
      .mockRejectedValue(new Error('Delete error'));
    const res = await request(app)
      .delete('/api/winners/123')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(500);
  });
});
