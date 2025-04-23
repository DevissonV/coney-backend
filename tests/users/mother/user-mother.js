import db from '#core/config/database.js';
import { hashSync } from 'bcryptjs';

export const UserMother = {
  validCreateDTO: (overrides = {}) => ({
    email: `test_${Date.now()}@test.com`,
    firstName: 'Test',
    lastName: 'User',
    password: 'StrongPass123',
    role: 'user',
    ...overrides,
  }),

  async insertUser(overrides = {}) {
    const user = this.validCreateDTO(overrides);
    const [id] = await db('users')
      .insert({
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        password: hashSync(user.password, 10),
        role: user.role,
        is_email_validated: true,
      })
      .returning('id');
    return { id, ...user };
  },
};
