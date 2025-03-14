import request from 'supertest';
import app from '../../src/server.js';

/**
 * Generates a unique email for test users.
 * @returns {string} Unique email.
 */
const generateTestEmail = () => {
  return `testuser_${Date.now()}@prueba.com`;
};

/**
 * Registers and logs in a test user, ensuring no duplicate user exists.
 * @returns {Promise<{token: string, userId: number}>} The authentication token and user ID.
 */
export const registerAndLoginUser = async () => {
  const testUser = {
    email: generateTestEmail(),
    firstName: 'UserX',
    lastName: 'Test',
    password: 'securepassword123',
    role: 'admin',
  };

  const createUserResponse = await request(app)
    .post('/api/users/')
    .send(testUser);

  if (createUserResponse.status !== 201) {
    throw new Error('User creation failed');
  }

  const userId = createUserResponse.body.data.id;

  const loginResponse = await request(app).post('/api/users/login').send({
    email: testUser.email,
    password: testUser.password,
  });

  if (loginResponse.status !== 200) {
    throw new Error('Login failed');
  }

  return { token: loginResponse.body.data.token, userId };
};
