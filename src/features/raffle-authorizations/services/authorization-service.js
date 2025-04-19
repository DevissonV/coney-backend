import { AppError } from '#core/utils/response/error-handler.js';
import { getLogger } from '#core/utils/logger/logger.js';
import authorizationRepository from '../repositories/authorization-repository.js';
import {
  createAuthorizationDto,
  updateAuthorizationDto,
} from '../dto/authorization-dto.js';
import { validateAuthorizationCreate } from '../validations/authorization-create-validation.js';
import { validateAuthorizationUpdate } from '../validations/authorization-status-update-validation.js';

/**
 * Service for managing raffle authorization records.
 * Limited to CRUD operations only.
 * @class AuthorizationService
 */
class AuthorizationService {
  /**
   * Creates a new authorization entry.
   *
   * @param {Object} data - Input data for creation.
   * @returns {Promise<Object>} The created authorization record.
   * @throws {AppError} If creation fails or validation fails.
   */
  async create(data) {
    try {
      const validated = validateAuthorizationCreate(data);
      const dto = createAuthorizationDto(validated);
      return await authorizationRepository.create(dto);
    } catch (error) {
      getLogger().error(`Error creating authorization: ${error.message}`);
      throw new AppError(
        error.message || 'Failed to create authorization',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Updates an existing authorization by ID.
   *
   * @param {number} id - ID of the authorization record.
   * @param {Object} data - Data to update.
   * @returns {Promise<Object>} The updated record.
   * @throws {AppError} If update fails or validation fails.
   */
  async update(id, data) {
    try {
      const validated = validateAuthorizationUpdate(data);
      const dto = updateAuthorizationDto(validated);
      return await authorizationRepository.update(id, dto);
    } catch (error) {
      getLogger().error(`Error updating authorization ${id}: ${error.message}`);
      throw new AppError(
        error.message || 'Failed to update authorization',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Retrieves a single authorization by its ID.
   *
   * @param {number} id - ID of the record.
   * @returns {Promise<Object>} The retrieved authorization.
   * @throws {AppError} If not found or retrieval fails.
   */
  async getById(id) {
    try {
      const auth = await authorizationRepository.getById(id);
      if (!auth) {
        throw new AppError(`Authorization ${id} not found`, 404);
      }
      return auth;
    } catch (error) {
      getLogger().error(
        `Error retrieving authorization ${id}: ${error.message}`,
      );
      throw new AppError(
        error.message || 'Failed to fetch authorization',
        error.statusCode || 500,
      );
    }
  }

  /**
   * Deletes an authorization by its ID.
   *
   * @param {number} id - ID of the authorization.
   * @returns {Promise<void>}
   * @throws {AppError} If deletion fails.
   */
  async delete(id) {
    try {
      const authorization = await this.getById(id);
      return await authorizationRepository.delete(authorization.id);
    } catch (error) {
      getLogger().error(`Error deleting authorization ${id}: ${error.message}`);
      throw new AppError(
        error.message || 'Failed to delete authorization',
        error.statusCode || 500,
      );
    }
  }
}

export default new AuthorizationService();
