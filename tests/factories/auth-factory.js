import request from 'supertest';
import app from '../../src/server.js';

/**
 * Registers and logs in a test user, ensuring no duplicate user exists.
 * @returns {Promise<string>} The authentication token.
 */
export const registerAndLoginUser = async () => {
  const testUser = {
    username: 'userCreatedForTesting',
    password: 'securepassword123',
    role: 'admin',
  };

  await request(app)
    .delete('/api/users/')
    .send({ username: testUser.username });

  await request(app).post('/api/users/register').send(testUser);

  const loginResponse = await request(app).post('/api/users/login').send({
    username: testUser.username,
    password: testUser.password,
  });

  return loginResponse.body.data.token;
};
