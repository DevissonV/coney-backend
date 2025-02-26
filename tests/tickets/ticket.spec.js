import app from '../../src/server.js';
import request from 'supertest';
import { registerAndLoginUser } from '../factories/auth-factory.js';

describe('Tickets API', () => {
  let token;
  let createdTicketId;
  let createdRaffleId;

  beforeAll(async () => {
    token = await registerAndLoginUser();

    const raffleResponse = await request(app)
      .post('/api/raffles/')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Raffle for Tickets',
        description: 'Raffle for ticket testing',
        init_date: '2025-02-01T00:00:00.000Z',
        end_date: '2025-03-01T00:00:00.000Z',
      });

    createdRaffleId = raffleResponse.body.data[0].id;
  });

  it('should create a new ticket', async () => {
    const ticketData = {
      ticket_number: 1,
      raffle_id: createdRaffleId,
      user_id: null,
    };

    const response = await request(app)
      .post('/api/tickets/')
      .set('Authorization', `Bearer ${token}`)
      .send(ticketData);

    expect(response.status).toBe(201);
    expect(response.body.data[0]).toHaveProperty(
      'ticket_number',
      ticketData.ticket_number,
    );
    createdTicketId = response.body.data[0].id;
  });

  it('should get all tickets', async () => {
    const response = await request(app)
      .get('/api/tickets/')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should get a single ticket by ID', async () => {
    const response = await request(app)
      .get(`/api/tickets/${createdTicketId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('id', createdTicketId);
  });

  it('should delete a ticket', async () => {
    const response = await request(app)
      .delete(`/api/tickets/${createdTicketId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', true);
  });
});
