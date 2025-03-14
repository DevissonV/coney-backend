import BaseRepository from '#core/base/base-repository.js';
import db from '#core/config/database.js';

/**
 * Repository for managing users data.
 * @class UserRepository
 * @extends BaseRepository
 */
class UserRepository extends BaseRepository {
  /**
   * Initializes the repository with the `users` table.
   */
  constructor() {
    super('users');
  }

  /**
   * Removes sensitive fields (`password`) from a user record.
   *
   * @param {Object} record - The user record.
   * @returns {Object} The sanitized user record.
   * @protected
   */
  sanitizeRecord(record) {
    const { password, ...sanitizedRecord } = record;
    return sanitizedRecord;
  }

  /**
   * Retrieves a user by email.
   * This method is primarily used for authentication and includes the password field.
   *
   * @param {string} email - The email of the user to search for.
   * @returns {Promise<Object|null>} The user object if found, otherwise null.
   */
  async findByEmail(email) {
    return db('users')
      .where({ email })
      .select('id', 'email', 'first_name', 'last_name', 'role', 'password')
      .first();
  }
}

export default new UserRepository();
