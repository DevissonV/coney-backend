import bcrypt from 'bcryptjs';
import { AppError } from '#core/utils/response/error-handler.js';
import { getLogger } from '#core/utils/logger/logger.js';
import GenericCriteria from '#core/filters/criteria/generic-criteria.js';
import userRepository from '../repositories/user-repository.js';
import { validateUserCreate } from '../validations/user-create-validation.js';
import { validateUserUpdate } from '../validations/user-update-validation.js';
import { validateUserCriteria } from '../validations/user-criteria-validation.js';
import {
  createUserDto,
  updateUserDto,
  searchUserDto,
} from '../dto/user-dto.js';

/**
 * Service class for handling user business logic.
 * @class UserService
 */
class UserService {
  /**
   * Retrieves all users.
   * @param {Object} params - Query parameters.
   * @returns {Promise<Object[]>} List of users.
   */
  async getAll(params) {
    try {
      const validatedParams = validateUserCriteria(params);
      const dto = searchUserDto(validatedParams);

      const criteria = new GenericCriteria(dto, {
        email: { column: 'email', operator: '=' },
        first_name: { column: 'first_name', operator: 'ILIKE' },
        last_name: { column: 'last_name', operator: 'ILIKE' },
        role: { column: 'role', operator: '=' },
        is_email_validated: { column: 'is_email_validated', operator: '=' },
        is_user_authorized: { column: 'is_user_authorized', operator: '=' },
      });

      return await userRepository.getAll(criteria);
    } catch (error) {
      getLogger().error(`Error getAll users: ${error.message}`);
      throw new AppError(
        error.message || 'Database error while retrieving users',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Retrieves a single user by ID.
   * @param {number} id - User ID.
   * @returns {Promise<Object>} User data.
   */
  async getById(id) {
    try {
      const user = await userRepository.getById(id);
      if (!user) throw new AppError(`User with ID ${id} not found`, 404);
      return user;
    } catch (error) {
      getLogger().error(`Error getById user: ${error.message}`);
      throw new AppError(
        error.message || 'Database error while retrieving user',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Creates a new users.
   * @param {Object} data - Users details.
   * @returns {Promise<Object>} Created users data.
   */
  async create(data) {
    try {
      validateUserCreate(data);
      data.password = await bcrypt.hash(data.password, 10);
      const dto = createUserDto(data);
      return await userRepository.create(dto);
    } catch (error) {
      getLogger().error(`Error create user: ${error.message}`);
      throw new AppError(
        error.message || 'Database error while creating user',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Updates an existing user.
   * @param {number} id - User ID.
   * @param {Object} data - Updated User details.
   * @returns {Promise<Object>} Updated user data.
   */
  async update(id, data) {
    try {
      const user = await this.getById(id);
      validateUserUpdate(data);
      const dto = updateUserDto(data);
      return await userRepository.update(user.id, dto);
    } catch (error) {
      getLogger().error(`Error update user: ${error.message}`);
      throw new AppError(
        error.message || 'Database error while updating user',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Deletes a user by ID.
   * @param {number} id - User ID.
   * @returns {Promise<void>} Resolves when the deletion is complete.
   */
  async delete(id) {
    try {
      const user = await this.getById(id);
      return await userRepository.delete(user.id);
    } catch (error) {
      getLogger().error(`Error delete user: ${error.message}`);
      throw new AppError(
        error.message || 'Database error while deleting user',
        error.statusCode || 500,
      );
    }
  }
}

export default new UserService();
