import request from 'supertest';
import app from '../../src/server.js';
import { registerAndLoginUser } from '../factories/auth-factory.js';
import dayjs from 'dayjs';

const today = dayjs().add(1, 'day').toISOString();
const futureDate = dayjs().add(30, 'day').toISOString();

/**
 * Create a stress test.
 * @param {string} token
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

  const raffleResponse = await request(app)
    .post('/api/raffles/')
    .set('Authorization', `Bearer ${token}`)
    .send(raffleData);

  expect(raffleResponse.status).toBe(201);
  expect(raffleResponse.body).toHaveProperty('data');
  return raffleResponse.body.data;
}

/**
 * Reserve the first available raffle ticket.
 * @param {string} token
 * @param {number} raffleId
 * @param {number} userId
 * @returns {Promise<Object>}
 */
async function reserveFirstTicket(token, raffleId, userId) {
  const ticketsResponse = await request(app)
    .get(`/api/tickets/?raffle_id=${raffleId}&limit=1&page=1`)
    .set('Authorization', `Bearer ${token}`);

  expect(ticketsResponse.status).toBe(200);
  expect(ticketsResponse.body.data.length).toBeGreaterThan(0);

  const ticket = ticketsResponse.body.data[0];

  const ticketUpdateResponse = await request(app)
    .patch(`/api/tickets/${ticket.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      ticketNumber: ticket.ticket_number,
      raffleId: raffleId,
      userId: userId,
    });
  expect(ticketUpdateResponse.status).toBe(200);
  return ticketUpdateResponse.body.data;
}

describe('Winners API', () => {
  let token;
  let userId;
  let createdRaffleId;
  let winnerId;
  let reservedTicketId;

  beforeAll(async () => {
    const authResult = await registerAndLoginUser();
    token = authResult.token;
    userId = authResult.userId;

    const raffle = await createTestRaffle(token);
    createdRaffleId = raffle.id;

    const reservedTicket = await reserveFirstTicket(
      token,
      createdRaffleId,
      userId,
    );
    reservedTicketId = reservedTicket.id;
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

  it('should get winners (initially empty)', async () => {
    const response = await request(app)
      .get('/api/winners/?limit=3&page=1')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should create a winner for a raffle', async () => {
    const response = await request(app)
      .post('/api/winners')
      .set('Authorization', `Bearer ${token}`)
      .send({ raffle_id: createdRaffleId });
    expect(response.status).toBeLessThan(300);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('raffle_id', createdRaffleId);
    winnerId = response.body.data.id;
  });

  it('should not create a winner if one already exists for the raffle', async () => {
    const response = await request(app)
      .post('/api/winners')
      .set('Authorization', `Bearer ${token}`)
      .send({ raffle_id: createdRaffleId });
    expect(response.status).toBe(400);
  });

  it('should get a winner by ID', async () => {
    const response = await request(app)
      .get(`/api/winners/${winnerId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('id', winnerId);
  });

  it('should delete the created winner', async () => {
    const response = await request(app)
      .delete(`/api/winners/${winnerId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    const getResponse = await request(app)
      .get(`/api/winners/${winnerId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(getResponse.status).toBe(404);
  });
});
