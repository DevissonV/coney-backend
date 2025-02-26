import app from '../../src/server.js';
import request from 'supertest';
import { registerAndLoginUser } from '../factories/auth-factory.js';

describe('Countries API', () => {
  let token;
  let createdCountryId;

  beforeAll(async () => {
    token = await registerAndLoginUser();
  });

  it('should create a new country', async () => {
    const countryData = { name: 'Test Country' };

    const response = await request(app)
      .post('/api/countries/')
      .set('Authorization', `Bearer ${token}`)
      .send(countryData);

    expect(response.status).toBe(201);
    expect(response.body.data[0]).toHaveProperty('name', countryData.name);
    createdCountryId = response.body.data[0].id;
  });

  it('should get all countries', async () => {
    const response = await request(app)
      .get('/api/countries/')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should get a single country by ID', async () => {
    const response = await request(app)
      .get(`/api/countries/${createdCountryId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('id', createdCountryId);
  });

  it('should update a country', async () => {
    const updatedData = { name: 'Updated Test Country' };

    const response = await request(app)
      .patch(`/api/countries/${createdCountryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);

    expect(response.status).toBe(200);
  });

  it('should delete a country', async () => {
    const response = await request(app)
      .delete(`/api/countries/${createdCountryId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', true);
  });
});
