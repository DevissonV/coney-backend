import request from 'supertest';
import app from '../../src/server.js';
import { registerAndLoginUser } from '../factories/auth-factory.js';
import { UserMother } from './mother/user-mother.js';

describe('Users API - Integration', () => {
  let token;
  let userId;
  let createdUserId;
  let email;
  let password;

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

  it('should create a user', async () => {
    const newUser = UserMother.validCreateDTO();

    const response = await request(app).post('/api/users/').send(newUser);
    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('id');

    createdUserId = response.body.data.id;
    email = response.body.data.email;
    password = newUser.password;
  });

  it('should login the created user', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({ email, password });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('token');
  });

  it('should list users with pagination', async () => {
    const response = await request(app)
      .get('/api/users/?limit=3&page=1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should get user by ID', async () => {
    const response = await request(app)
      .get(`/api/users/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(createdUserId);
  });

  it('should update the user', async () => {
    const updatedData = {
      firstName: 'Updated',
      lastName: 'User',
      role: 'admin',
    };

    const response = await request(app)
      .patch(`/api/users/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.data.first_name).toBe(updatedData.firstName);
    expect(response.body.data.last_name).toBe(updatedData.lastName);
  });

  it('should delete the user', async () => {
    const response = await request(app)
      .delete(`/api/users/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
  });
});
