import app from '../../src/server.js';
import request from 'supertest';
import { registerAndLoginUser } from '../factories/auth-factory.js';
import dayjs from 'dayjs';

describe('Tickets API', () => {
  let token;
  let userId;
  let createdTicketId;
  let createdRaffleId;

  const today = dayjs().add(1, 'day').toISOString();
  const futureDate = dayjs().add(30, 'day').toISOString();

  beforeAll(async () => {
    const result = await registerAndLoginUser();
    token = result.token;
    userId = result.userId;

    const raffleResponse = await request(app)
      .post('/api/raffles/')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Raffle for Tickets',
        description: 'Raffle for ticket testing',
        initDate: today,
        endDate: futureDate,
        price: 15000,
        ticketCount: 10,
      });

    expect(raffleResponse.status).toBe(201);
    expect(raffleResponse.body).toHaveProperty('data');
    expect(raffleResponse.body.data).toHaveProperty('id');

    createdRaffleId = raffleResponse.body.data.id;
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

  it('should create a new ticket', async () => {
    const ticketData = {
      ticketNumber: 100000000,
      raffleId: createdRaffleId,
      userId: null,
    };

    const response = await request(app)
      .post('/api/tickets/')
      .set('Authorization', `Bearer ${token}`)
      .send(ticketData);

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty(
      'ticket_number',
      ticketData.ticketNumber,
    );
    createdTicketId = response.body.data.id;
  });

  it('should get all tickets', async () => {
    const response = await request(app)
      .get('/api/tickets/')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should get available tickets', async () => {
    const response = await request(app).get(
      `/api/tickets/availables?raffle_id=${createdRaffleId}`,
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
  });

  it('should get a single ticket by ID', async () => {
    const response = await request(app)
      .get(`/api/tickets/${createdTicketId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('id', createdTicketId);
  });

  it('should update a ticket', async () => {
    const updatedData = {
      ticketNumber: 999999,
      userId: userId,
      raffleId: createdRaffleId,
    };

    const response = await request(app)
      .patch(`/api/tickets/${createdTicketId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);

    expect(response.status).toBe(200);
  });

  it('should delete a ticket', async () => {
    expect(createdTicketId).toBeDefined();
    const response = await request(app)
      .delete(`/api/tickets/${createdTicketId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', true);
  });
});
