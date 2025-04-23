import { jest } from '@jest/globals';
import bcrypt from 'bcryptjs';

import request from 'supertest';
import app from '../../src/server.js';
import { registerAndLoginUser } from '../factories/auth-factory.js';
import { UserMother } from './mother/user-mother.js';
import userRepository from '#features/users/repositories/user-repository.js';
import userService from '#features/users/services/user-service.js';
import { AppError } from '#core/utils/response/error-handler.js';
import { getLogger } from '#core/utils/logger/logger.js';

let logger = getLogger();
let token;
let userId;

beforeAll(async () => {
  const result = await registerAndLoginUser();
  token = result.token;
  userId = result.userId;
});

describe('Users API - Integration', () => {
  let createdUserId;
  let email;
  let password;

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

  it('should retrieve all users based on validated criteria', async () => {
    const mockParams = { email: 'test@example.com', page: 1 };
    const mockUsers = [{ id: 1, email: 'test@example.com' }];

    jest.spyOn(userRepository, 'getAll').mockResolvedValue(mockUsers);

    const result = await userService.getAll(mockParams);

    expect(result).toEqual(mockUsers);
    expect(userRepository.getAll).toHaveBeenCalled();
  });
});

describe('Users API - Integration (Errores)', () => {
  it('should return 400 when creating a user with invalid data', async () => {
    const invalidUser = { email: 'bad-email', password: '123' };

    const res = await request(app).post('/api/users/').send(invalidUser);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('should return 404 when retrieving a non-existent user', async () => {
    const nonExistentId = 99999;
    const res = await request(app)
      .get(`/api/users/${nonExistentId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });

  it('should return 400 when updating user with invalid data', async () => {
    const user = UserMother.validCreateDTO();
    const createRes = await request(app).post('/api/users/').send(user);
    const tempUserId = createRes.body.data.id;

    const invalidData = { password: '123' };

    const res = await request(app)
      .patch(`/api/users/${tempUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(invalidData);

    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();

    await request(app)
      .delete(`/api/users/${tempUserId}`)
      .set('Authorization', `Bearer ${token}`);
  });

  it('should return 404 when deleting a non-existent user', async () => {
    const nonExistentId = 99999;
    const res = await request(app)
      .delete(`/api/users/${nonExistentId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });

  it('should throw AppError when repository fails on getAll', async () => {
    const mockParams = { email: 'test@example.com' };
    const error = new Error('DB crashed');

    jest.spyOn(userRepository, 'getAll').mockRejectedValue(error);
    const logSpy = jest.spyOn(logger, 'error').mockImplementation(() => {});

    await expect(userService.getAll(mockParams)).rejects.toThrow(AppError);
    expect(logSpy).toHaveBeenCalledWith(`Error getAll users: ${error.message}`);
  });

  it('should hash password if present in update data', async () => {
    const plainPassword = 'secret123';
    const hashedPassword = 'hashedSecret123';

    const user = { id: 10 };
    const inputData = { firstName: 'John', password: plainPassword };

    jest.spyOn(userService, 'getById').mockResolvedValue(user);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
    const updateSpy = jest
      .spyOn(userRepository, 'update')
      .mockResolvedValue({ id: user.id });

    await userService.update(user.id, inputData);

    expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, 10);
    expect(updateSpy).toHaveBeenCalledWith(
      user.id,
      expect.objectContaining({ password: hashedPassword }),
    );
  });
});
