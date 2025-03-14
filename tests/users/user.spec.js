import request from 'supertest';
import app from '../../src/server.js';
import { registerAndLoginUser } from '../factories/auth-factory.js';

describe('Users API', () => {
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

  it('should create user', async () => {
    const newUser = {
      email: `test_${Date.now()}@prueba.com`,
      firstName: 'Test',
      lastName: 'User',
      password: 'securepassword123',
      role: 'admin',
    };

    const response = await request(app).post('/api/users/').send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('id');

    createdUserId = response.body.data.id;
    email = response.body.data.email;
    password = newUser.password;
  });

  it('should login an existing user', async () => {
    const loginData = {
      email,
      password,
    };

    const response = await request(app)
      .post('/api/users/login')
      .send(loginData);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('token');
  });

  it('should get all users with pagination', async () => {
    const response = await request(app)
      .get('/api/users/?limit=3&page=1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should get user by ID', async () => {
    const response = await request(app)
      .get(`/api/users/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('id', createdUserId);
  });

  it('should update an existing user (except email)', async () => {
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
    expect(response.body.data).toHaveProperty(
      'first_name',
      updatedData.firstName,
    );
    expect(response.body.data).toHaveProperty(
      'last_name',
      updatedData.lastName,
    );
  });

  it('should delete user created', async () => {
    const response = await request(app)
      .delete(`/api/users/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', true);
  });
});
